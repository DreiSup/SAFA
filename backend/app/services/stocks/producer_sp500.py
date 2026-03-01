import time
import json
import requests
import yfinance as yf
from confluent_kafka import Producer
from datetime import datetime
import pytz


# CONFIGURACION
KAFKA_TOPIC = 'sp500_ticker'
KAFKA_CONF = {
    'bootstrap.servers': 'localhost:9092', # Kafka en Docker
    'client.id': 'safa-sp500-producer'
}
API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'

# --- DISCIPLINA DE LÍMITES ---
INTERVAL = 60     # Segundos entre peticiones normales (Más relajado)

def delivery_report(err, msg):
    """ Callback: Se llama cuando el mensaje ha sido enviado (o ha fallado) """
    if err is not None:
        print(f'Error enviando mensaje: {err}')
    else:
        print(f'Enviado a {msg.topic()} [{msg.partition()}]: {msg.value().decode("utf-8")}')

def is_market_open():
    """Verifica si Wall Street está abierto"""
    ny_tz = pytz.timezone("America/New_York")
    now = datetime.now(ny_tz)

    if now.weekday() >= 5:
        return False
    
    if now.hour < 9 or (now.hour == 9 and now.minute < 30) or now.hour >= 16:
        return False
    
    return True

def run_producer():
    # Crear el producer
    producer = Producer(KAFKA_CONF)
    ticker = yf.Ticker('^GSPC') # S&P 500 Index

    print(f"Productor de SP500 iniciado. Intervalo: {INTERVAL}.")

    try:
        while True:
            # Obtener precio real (Binance API)
            if not is_market_open():
                print("💤 Wall Street está cerrado. El precio no cambiará. Esperando 60s...")
                time.sleep(60)
                continue

            try:
                # fast_info es la forma más ligera y rápida de obtener el precio en vivo en yfinance
                precio_actual = ticker.fast_info.last_price

                # Preparamos el JSON (misma estructura que BTC para mantener uniformidad)
                mensaje = {
                    "asset": "S&P 500",
                    "symbol": "^GSPC",
                    "price": float(precio_actual),
                    "timestamp": time.time(),
                    "source": "yfinance"
                }

                # Enviar a Kafka
                producer.produce(KAFKA_TOPIC, json.dumps(mensaje).encode('utf-8'), callback=delivery_report)

                # Forzar que se envíen los paquetes encolados
                producer.poll(0)

                # Feedback visual mínimo (un punto cada vez que envía)
                print("_", end="", flush=True)

            except Exception as e:
                print(f"⚠️ Error obteniendo datos de Yahoo Finance: {e}")

                
            time.sleep(INTERVAL)


    except KeyboardInterrupt:
        print("\n Deteniendo productor...")

    finally:
        # Asegurarse de enviar todo antes de cerrar
        producer.flush()

if __name__ == '__main__':
    run_producer()
        