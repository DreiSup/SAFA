import json
from confluent_kafka import Consumer, KafkaError
from .extensions import socketio
from .schemas.macro_schema import BitcoinPriceSchema, SP500PriceSchema
from .repositories.mongo_repository import insert_one, ensure_ttl_index
from .utils.logger_setup import get_logger

logger = get_logger("WebSockets")

bitcoin_schema = BitcoinPriceSchema()
sp500_schema = SP500PriceSchema()

KAFKA_CONF_BTC = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'safa-websocket-btc',
    'auto.offset.reset': 'latest'
}
KAFKA_CONF_SP500 = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'safa-websocket-sp500',
    'auto.offset.reset': 'latest'
}

COLLECTION_TICKS = 'prices_ticks'
TTL_SECONDS = 172800  # 48 horas


def emit_realtime_data_btc():
    # Crear el índice TTL la primera vez que arranca el hilo
    ensure_ttl_index(COLLECTION_TICKS, 'timestamp', TTL_SECONDS)

    consumer = Consumer(KAFKA_CONF_BTC)
    consumer.subscribe(['bitcoin_ticker'])

    logger.info("WebSocket BTC iniciado. Escuchando Kafka...")

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
                    logger.error(f"Error Kafka BTC: {msg.error()}")
                    continue

            try:
                data_json = json.loads(msg.value().decode('utf-8'))
                insert_one(COLLECTION_TICKS, data_json)
                dato_validado = bitcoin_schema.dump(data_json)
                socketio.emit('update_btc', dato_validado)
                logger.info(f"BTC emitido | Precio: {data_json['price']}")

            except Exception as e:
                logger.error(f"Error procesando mensaje BTC: {e}")

    except Exception as e:
        logger.error(f"Error en hilo WebSocket BTC: {e}")
    finally:
        consumer.close()


def emit_realtime_data_sp500():
    consumer = Consumer(KAFKA_CONF_SP500)
    consumer.subscribe(['sp500_ticker'])

    logger.info("WebSocket SP500 iniciado. Escuchando Kafka...")

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
                    logger.error(f"Error Kafka SP500: {msg.error()}")
                    continue

            try:
                data_json = json.loads(msg.value().decode('utf-8'))
                insert_one(COLLECTION_TICKS, data_json)
                dato_validado = sp500_schema.dump(data_json)
                socketio.emit('update_sp500', dato_validado)
                logger.info(f"SP500 emitido | Precio: {data_json['price']}")

            except Exception as e:
                logger.error(f"Error procesando mensaje SP500: {e}")

    except Exception as e:
        logger.error(f"Error en hilo WebSocket SP500: {e}")
    finally:
        consumer.close()
