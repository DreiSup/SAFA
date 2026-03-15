import os
from pymongo import MongoClient
from .extensions import socketio
# Importamos el esquema (asumo que se llama así basándome en el del SP500)
from .schemas.macro_schema import BitcoinPriceSchema


bitcoin_schema = BitcoinPriceSchema()

def emit_realtime_data():
    """
    Esta función corre en un bucle infinito en un hilo separado.
    Vigila la base de datos y empuja el último precio a React.
    """
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://ysst:ysst@localhost:27020/')
    client = MongoClient(mongo_uri)
    db = client['safa_macro']
    collection = db['prices']

    print("🎙️ Locutor WebSocket iniciado. Vigilando base de datos...")

    ultimo_timestamp_enviado = 0

    while True: 
        try:
            cursor = collection.find().sort("timestamp", -1).limit(1)
            latest_record = list(cursor)

            if latest_record:
                record = latest_record[0]

                # Solo emitimos si es un dato nuevo (basado en el timestamp)
                if record['timestamp'] > ultimo_timestamp_enviado:

                    # 2. Validacion con Marshmallow
                    dato_validado = bitcoin_schema.dump(record)

                    # 3. Emisión por el túnel WebSocket
                    socketio.emit('update_btc', dato_validado)
                    
                    ultimo_timestamp_enviado = record['timestamp']

        except Exception as e:
            print(f"❌ Error en el hilo de WebSockets: {e}")

        # Dormimos 5 segundos (igualando el ritmo de tu Productor de Kafka)
        socketio.sleep(5)