from dotenv import load_dotenv
import os
import json
import time                                                                                              
import websocket
from confluent_kafka import Producer                                                                             
from app.utils.logger_setup import get_logger
from datetime import datetime, timezone

logger = get_logger("producer_alapaca_ws")

load_dotenv()
                                                                                               

ALPACA_API_KEY=os.getenv("ALPACA_API_KEY")
ALPACA_SECRET_KEY=os.getenv("ALPACA_SECRET_KEY")

TOPIC="stock_prices"
WS_URL="wss://stream.data.alpaca.markets/v2/iex"

KAFKA_CONFIG = {
        "bootstrap.servers" : "localhost:9092",
        "client.id" : "safa-alpaca-ws-producer"
}

BACKOFF_INITIAL = 5
BACKOFF_MAX = 60

producer = Producer(KAFKA_CONFIG)

def on_delivery(err, msg):
    #esto se llama cuando Kafka confirma, o falla al envío de un mensaje.
    if err:
        logger.error(f"Kafka delivery error: {err}")

def on_open(ws): 
    logger.info("Conectando a Alpaca Websocket")

def on_message(ws, message):
    try:
        data= json.loads(message)
        for msg in data:
            if msg.get("T") == "success" and msg.get("msg") == "connected":
                auth_msg={
                    "action": "auth",
                    "key": ALPACA_API_KEY,
                    "secret": ALPACA_SECRET_KEY
                }
                ws.send(json.dumps(auth_msg))
                logger.info("Autenticación enviada a Alpaca")
            elif msg.get("T") == "success" and msg.get("msg") == "authenticated":
                ws.send(json.dumps({"action": "subscribe", "trades": ["SPY"]}))
                logger.info("Subscripción enviada a Alpaca")
            elif msg.get("T") == "t":
                tick = {
                    "symbol": msg["S"],
                    "asset_class": "stock",
                    "price": float(msg["p"]),
                    "timestamp": datetime.fromisoformat(msg["t"].replace("Z", "+00:00")).timestamp(),
                    "source": "alpaca_ws"
                }
                producer.produce(TOPIC, json.dumps(tick).encode("utf-8"), callback=on_delivery)
                producer.poll(0)
                logger.info(f"Tick enviado: {tick['price']}")
            else:
                logger.warning(f"Mensaje no manejado a Alpaca:{msg}")
    except Exception as e:
        logger.error(f"(Alpaca) Erron en on_message: {e}")

def on_error(ws, error):
    logger.error(f"Alpaca Websockets error: {type(error).__name__}: {error}")

def on_close(ws, close_status_code, close_msg):
    logger.warning(f"Alpaca Websockets cerrado: {close_status_code} - {close_msg}")


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
            logger.error(f"Error inesperado en (Alpaca) WebSocketApp: {e}")

        logger.warning(f"Reconectando en {backoff}s...")
        time.sleep(backoff)
        backoff = min(backoff * 2, BACKOFF_MAX)

if __name__ == "__main__":
    connect()