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

    try:
        while True:
            # Obtener precio real (Binance API)
            try:
                response = requests.get(API_URL, timeout=5)
                data = response.json()

                # Preparamos JSON
                mensaje = {
                    "asset": "Bitcoin",
                    "symbol": "BTC/USTD",
                    "price": float(data['price']),
                    "timestamp": time.time()
                }

                # Convertir a bytes para Kafka
                mensaje_bytes = json.dumps(mensaje).encode('utf-8')

                # Enviar a Kafka
                # produce(topic, value, callback) es asíncrono
                producer.produce(KAFKA_TOPIC, value=mensaje_bytes, callback=delivery_report)

                # Forzar que se envíen los paquetes encolados
                producer.poll(0)
            
            except Exception as e: 
                print(f"Error obteniendo precio: {e}")

            time.sleep(2)
    except KeyboardInterrupt:
        print("\n Deteniendo productor...")

    finally:
        # Asegurarse de enviar todo antes de cerrar
        producer.flush()

if __name__ == '__main__':
    run_producer()
        