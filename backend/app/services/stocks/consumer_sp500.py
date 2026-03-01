import json
import time
from confluent_kafka import Consumer, KafkaError
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# --- CONFIGURACION KAFKA ---
KAFKA_CONF = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'safa-sp500-group',  # Importante: Identifica quién lee
    'auto.offset.reset': 'earliest'  # Si me pierdo, leo desde el principio
}
TOPIC = 'sp500_ticker'

load_dotenv()

MONGO_URI=os.getenv('MONGO_URI')
DB_NAME='safa_macro'
COLLECTION_NAME = 'sp500_prices'

# --- DISCIPLINA: VERIFICACIÓN VISUAL ---
print(f"🔍 DEBUG: Intentando conectar a Mongo con esta URI: {MONGO_URI}")

def run_consumer():
    try: 
        mongo_client = MongoClient(MONGO_URI)
        db = mongo_client[DB_NAME]
        collection = db[COLLECTION_NAME]

        mongo_client.admin.command('ping')
        print("Conectado exitosamente a MongoDB")
    except Exception as e:
        print(f"Error conectando a Mongo: {e}")
        return
    
    consumer = Consumer(KAFKA_CONF)
    consumer.subscribe([TOPIC])


    try: 
        while True:
            # Escichar mensajes (espera 1s máximo por bloque)
            msg = consumer.poll(1.0)

            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else: 
                    print(f"Error Kafka:{msg.error()}")
                    continue
            
            try:
                # Decodificamos bytes a JSON
                data_str = msg.value().decode('utf-8')
                data_json = json.loads(data_str)

                result = collection.insert_one(data_json)

                print(f"💾 Guardado en Mongo ID: {result.inserted_id} | Precio: {data_json['price']}")

            except Exception as e:
                print(f"❌ Error procesando mensaje: {e}")


    except KeyboardInterrupt:
        print("\n🛑 Consumidor detenido.")
    finally:
        consumer.close()
        mongo_client.close()


if __name__ == '__main__':
    run_consumer()