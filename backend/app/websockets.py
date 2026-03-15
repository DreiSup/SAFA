import json
from confluent_kafka import Consumer, KafkaError
from .extensions import socketio
from .schemas.macro_schema import BitcoinPriceSchema
from .repositories.mongo_repository import insert_one
from .utils.logger_setup import get_logger

logger = get_logger("WebSockets")

bitcoin_schema = BitcoinPriceSchema()

KAFKA_CONF = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'safa-websocket-group',
    'auto.offset.reset': 'latest'
}
TOPIC = 'bitcoin_ticker'
COLLECTION_NAME = 'prices'


def emit_realtime_data():
    consumer = Consumer(KAFKA_CONF)
    consumer.subscribe([TOPIC])

    logger.info("WebSocket iniciado. Escuchando Kafka...")

    try:
        while True:
            msg = consumer.poll(1.0)

            if msg is None:
                socketio.sleep(0)
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    logger.error(f"Error Kafka: {msg.error()}")
                    continue

            try:
                data_json = json.loads(msg.value().decode('utf-8'))

                insert_one(COLLECTION_NAME, data_json)

                dato_validado = bitcoin_schema.dump(data_json)
                socketio.emit('update_btc', dato_validado)

                logger.info(f"Emitido y guardado | Precio: {data_json['price']}")

            except Exception as e:
                logger.error(f"Error procesando mensaje: {e}")

    except Exception as e:
        logger.error(f"Error en hilo WebSocket: {e}")
    finally:
        consumer.close()
