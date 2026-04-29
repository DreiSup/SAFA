import json                                                                                                      
import time                                                                                                      
import websocket                                                                                                 
from confluent_kafka import Producer                                                                             
from app.utils.logger_setup import get_logger

logger = get_logger("producer_binance_ws")

TOPIC="crypto_prices"
WS_URL="wss://stream.binance.com:9443/ws/btcusdt@aggTrade"

KAFKA_CONFIG = {
    "bootstrap.servers" : "localhost:9092",
    "client.id" : "safa-binance-ws-producer"
} 

BACKOFF_INITIAL = 5
BACKOFF_MAX = 60

producer = Producer(KAFKA_CONFIG)

def on_delivery(err, msg): 
    # Esto se llama cuando Kafka confirma, o falla el envío de un mensaje.
    if err:
        logger.error(f"Kafka delivery error: {err}")

def on_open(ws):
    # En caso de conectarse succesfully, mensaje
    logger.info("Conectado a Binance Websocket")

def on_message(ws, message):
    try:
        data = json.loads(message)
        tick = {
            "symbol": data["s"],
            "asset_class": "crypto",
            "price": float(data["p"]),
            "timestamp": data["T"] / 1000,
            "source": "binance_ws"
        }
        producer.produce(TOPIC, json.dumps(tick).encode("utf-8"), callback=on_delivery)
        producer.poll(0)
        logger.info(f"Tick enviado: {tick['price']}")
    except Exception as e:
        logger.error(f"(Binance) Error en on_message: {e}")

def on_error(ws, error):
    logger.error(f"Binance Websockets error: {type(error).__name__}: {error}")

def on_close(ws, close_status_code, close_msg):
    logger.warning(f"Binance Websockets cerrado: {close_status_code} - {close_msg}")


#FUNCION DE CONEXION CON BACKOFF
def connect():
    backoff = BACKOFF_INITIAL
    while True:
        try:
            ws = websocket.WebSocketApp(
                WS_URL,
                on_open=on_open,
                on_message=on_message,
                on_error=on_error,
                on_close=on_close
            )
            ws.run_forever()
        except Exception as e:
            logger.error(f"Error inesperado en (Binance) WebSocketApp: {e}")

        logger.warning(f"Reconectando en {backoff}s...")
        time.sleep(backoff)
        backoff = min(backoff * 2, BACKOFF_MAX)

if __name__ == "__main__":
    connect()