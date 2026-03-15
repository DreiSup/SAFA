import pyspark
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, udf
from pyspark.sql.types import StringType
import json
from app.schemas.macro_schema import MacroNewsSchema
from app.utils.logger_setup import get_logger
from app.services.finbert.sentiment_analyzer import analizar_sentimiento
from app.repositories.mongo_repository import insert_many


logger = get_logger("Spark_consumer")


# 🔥 Obtenemos la versión exacta que 'pip' instaló en tu PC (ej. 3.5.1)
version_spark = pyspark.__version__
# Inyectamos esa versión exacta asegurando que el motor y el conector sean idénticos
paquete_kafka = f"org.apache.spark:spark-sql-kafka-0-10_2.12:{version_spark}"


#---------------------------------
# 1. INICIAR EL MOTOR CENTRAL (SparkSession) 
#---------------------------------
# Le decimos a Spark qie vamos a necesitar el conector oficial de Kafka
spark = SparkSession.builder \
    .appName("SAFA_Macro_Brain_v2") \
    .config("spark.jars.packages", paquete_kafka) \
    .getOrCreate()

# Reducimos el ruido de los logs de Spark en la consola
spark.sparkContext.setLogLevel("WARN")


#----------------------------------
# 2. CREAR EL PUENTE DE VALIDACIÓN (UDF + Marshmallow)
#----------------------------------
def validar_new(json_string):
    """Esta función la ejecutarán los Workers de Spark en paralelo"""
    try:
        #1. Transformamos el texto crudo en un diccionario de Python
        data_crudos = json.loads(json_string)

        #2. MARSHMALLOW EN ACCION: Validamos contra el schema
        validator = MacroNewsSchema()
        data_limpios = validator.load(data_crudos) # Si falla, lanza ValidationError

        data_seguros = validator.dump(data_limpios)

        # 3. Si sobrevive a Marshmallow, devolvemos empaquetado
        return json.dumps(data_seguros)

    except Exception as e:
        #Si Marshmallow bloquea el dato, capturamos error y lo devolvemos 
        logger.error(f"Error en UDF: {e}")
        return "DATO_CORRUPTO"
    
# Convertimos nuestra función Python en una función que Spark entiende nativamente
validador_udf = udf(validar_new, StringType())

#----------------------------------
# 3. CONECTAR A KAFKA, INGESTA
#----------------------------------
logger.info("⏳ Conectando Spark a Kafka")
flujo_kafka = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "news_ticker") \
    .option("startingOffsets", "earliest") \
    .load()

#----------------------------------
# 4. FILTRO
#----------------------------------
# Kafka guarda el mensaje en una columna llamada 'value' en formato binario.
# Lo pasamos a texto y luego le aplicamos nuestra UDF de Marshmallow.
flujo_procesado = flujo_kafka \
    .withColumn("json_crudo", col("value").cast("string")) \
    .withColumn("json_validado", validador_udf(col("json_crudo")))

# Filtramos (descartamos) cualquier fila que Marshmallow haya marcado como corrupta
flujo_limpio = flujo_procesado.filter(col("json_validado") != "DATO_CORRUPTO")


#----------------------------------
# 5. LA SALIDA (para visualizar antes de meter FinBERT)
#----------------------------------
logger.info("Motor de Streaming Iniciado. Esperando news...")

def procesar_batch(batch_df, batch_id):
    # Acceso a los data de cada batch
    # batch_df es un DataFrame normal de Spark

    if batch_df.isEmpty():
        return
    
    lines = batch_df.collect()
    original_news = []
    texts = []

    """ logger.info(f"\n\nnewS ORIGINALES: {original_news}")
    logger.info(f"\n\ntexts: {texts}") """

    for line in lines:
        data = json.loads(line["json_validado"])
        original_news.append(data)
        texts.append(data["title"] + "." + data["description"])

    logger.info(f"texts: {texts}")

    resp_fin = analizar_sentimiento(texts)

    logger.info(f"\n\nREPUESTA FinBERT:\n\n {resp_fin}")

    news_to_mdb = []
    
    for new, sentimiento in zip(original_news, resp_fin):
        new.pop("description", None)
        news_to_mdb.append({**new,"sentiment": sentimiento})

    logger.info(f"\n\n\nnewS PARA MONGO: \n\n\n {news_to_mdb}")

    insert_many('sentiment_news' ,news_to_mdb)

    

query = flujo_limpio.select("json_validado") \
    .writeStream \
    .foreachBatch(procesar_batch) \
    .start()

query.awaitTermination()