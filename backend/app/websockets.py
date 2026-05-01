import json
from confluent_kafka import Consumer, KafkaError
from .extensions import socketio
from .schemas.macro_schema import price_tick_schema
from .repositories.mongo_repository import insert_one, ensure_ttl_index
from .utils.logger_setup import get_logger
from datetime import datetime, timezone

logger = get_logger("WebSockets")


COLLECTION_TICKS = 'prices_ticks'
TTL_SECONDS = 172800  # 48 horas


def emit_real_time_price(topic, event_name):
    consumer = Consumer({
        'bootstrap.servers': 'localhost:9092',
        'group.id': f'safa-websocket-{topic}',
        'auto.offset.reset': 'latest'
    })
    consumer.subscribe([topic])
    logger.info(f"Consumer iniciado. Topic: {topic}")

    try:
        while True:
            msg = consumer.poll(0.05)

            if msg is None:
                socketio.sleep(0)
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    socketio.sleep(0)
                    continue
                else:
                    logger.error(f"Error Kafka [{topic}]: {msg.error()}")
                    socketio.sleep(0)
                    continue
            
            try: 
                data_json = json.loads(msg.value().decode('utf-8'))
                dato_validado = price_tick_schema.dump(data_json)
                socketio.emit(event_name, dato_validado)
                dato_validado['created_at'] = datetime.now(timezone.utc)
                insert_one(COLLECTION_TICKS, dato_validado)
                """ logger.info(f"[{event_name}] Precio emitido: {data_json['price']}") """

            except Exception as e:
                logger.error(f"Error procesando mensaje [{topic}]: {e}")
        
    except Exception as e:
        logger.error(f"Error en hilo [{topic}]: {e}")
    finally:
        consumer.close()

def init_websockets():
    ensure_ttl_index(COLLECTION_TICKS, 'created_at', TTL_SECONDS)