import time
import json
import requests
from confluent_kafka import Producer

# CONFIGURACION
KAFKA_TOPIC = 'bitcoin_ticker'
KAFKA_CONF = {
    'bootstrap.servers': 'localhost:9092', # Kafka en Docker
    'client.id': 'safa-crypto-producer'
}
API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'

# --- DISCIPLINA DE LÍMITES ---
NORMAL_INTERVAL = 5      # Segundos entre peticiones normales (Más relajado)
ERROR_INTERVAL = 60

def delivery_report(err, msg):
    if err is not None:
        print(f"Error Kafka: {err}")

def delivery_report(err, msg):
    """ Callback: Sellama cuando el mensaje ha sido enviado (o ha fallado) """
    if err is not None:
        print(f'Error enviando mensaje: {err}')
    else:
        print(f'Enviado a {msg.topic()} [{msg.partition()}]: {msg.value().decode("utf-8")}')

def run_producer():
    # Crear el producer
    producer = Producer(KAFKA_CONF)
    print("Productor de Bitcoin iniciado. Intervalo: {NORMAL_INTERVAL}.")

    current_sleep = NORMAL_INTERVAL

    try:
        while True:
            # Obtener precio real (Binance API)
            try:
                response = requests.get(API_URL, timeout=5)

                if response.status_code == 429:
                    print(f"BINANCE NOS HA BLOQUEADO. Esperando {ERROR_INTERVAL}s para enfriar...")
                    time.sleep(ERROR_INTERVAL)
                    current_sleep = NORMAL_INTERVAL
                    continue

                if response.status_code != 200:
                    print(f"Error API: {response.status_code} - {response.text}")
                    time.sleep(NORMAL_INTERVAL)
                    continue

                data = response.json()

                # Preparamos JSON
                mensaje = {
                    "asset": "Bitcoin",
                    "symbol": "BTC/USTD",
                    "price": float(data['price']),
                    "timestamp": time.time(),
                    "source": "Binance REST"
                }

                # Enviar a Kafka
                # produce(topic, value, callback) es asíncrono
                producer.produce(KAFKA_TOPIC, json.dumps(mensaje).encode('utf-8'), callback=delivery_report)

                # Forzar que se envíen los paquetes encolados
                producer.poll(0)

                # Feedback visual mínimo (un punto cada vez que envía)
                print(".", end="", flush=True)
            
            except requests.exceptions.ConnectionError:
                print("\n🔌 Sin conexión a Internet. Reintentando...")
            except Exception as e:
                print(f"\n⚠️ Error inesperado: {e}")

            # Dormir lo que toque (normalmente 5s)
            time.sleep(current_sleep)

    except KeyboardInterrupt:
        print("\n Deteniendo productor...")

    finally:
        # Asegurarse de enviar todo antes de cerrar
        producer.flush()

if __name__ == '__main__':
    run_producer()
        