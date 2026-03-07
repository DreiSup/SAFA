import os
import json
import time
import requests
from confluent_kafka import Producer
from dotenv import load_dotenv
import urllib.parse
from app.utils.logger_setup import get_logger

# Inicializamos el logger pasándole el nombre de este archivo
logger = get_logger("Producer_News")

load_dotenv()

# --- CONFIGURACIÓN ---
KAFKA_TOPIC = 'news_ticker'
KAFKA_CONF = {
    'bootstrap.servers':'localhost:9092',
    'client.id': 'safa-news-producer'
}
NEWS_API_KEY = os.getenv('NEWS_API_KEY')
INTERVAL = 1800 # 30 min para no agotar las 100 peticiones diarias 

# Memoria para no enviar noticias repetidas al modelo de IA
titulares_enviados = set()
MAX_MEMORIA = 100 # Evitamos que la memoria RAM crezca infinitamente

def delivery_report(err, msg):
    if err is not None: 
        logger.error(f"Error enviando mensaje:{err}")
    else:
        # Imprimimos solo los primeros 30 caracteres del título para no saturar la consola
        logger.info (f"Titular enviado a Kafka: {msg.value().decode("utf-8")[15:45]}...")


def limpiar_memoria():
    """Mantiene la caché controlada vaciando la mitad si se llena mucho"""
    global titulares_enviados
    if len(titulares_enviados) > MAX_MEMORIA:
        # Convertimos a lista, cortamos la mitad más antigua (aprox) y volvemos a set
        titulares_enviados = set(list(titulares_enviados)[-50:])


def run_producer():
    if not NEWS_API_KEY:
        logger.error("❌ Error: Falta NEWS_API_KEY en el archivo .env")
        return

    producer = Producer(KAFKA_CONF)
    logger.info(f"📰 Productor de Noticias iniciado. Intervalo: {INTERVAL}s. Estrategia: Popularidad.")

    # 1. Definimos la query con comillas dobles para forzar la frase exacta
    query_raw = 'bitcoin OR "S&P 500" OR crypto OR "stock market"'
    
    # 2. Codificamos la query de forma segura (cambia espacios por %20, etc.)
    query_segura = urllib.parse.quote(query_raw)

    # 🔥 CAMBIO CLAVE: sortBy=popularity
    url = f"https://newsapi.org/v2/everything?q={query_segura}&language=en&sortBy=popularity&apiKey={NEWS_API_KEY}"

    try:
        while True:
            limpiar_memoria()
            
            try:
                response = requests.get(url)
                
                if response.status_code == 200:
                    data = response.json()
                    # Pedimos los 20 más populares, pero filtraremos los repetidos
                    articles = data.get('articles', [])[:20] 
                    nuevos_enviados = 0
                    
                    for article in articles:
                        titulo = article.get('title')
                        
                        # Filtros de calidad y duplicidad
                        if not titulo or titulo == '[Removed]' or titulo in titulares_enviados: 
                            continue

                        # 2. Lógica de clasificación (Etiquetado inteligente)
                        titulo_lower = titulo.lower()
                        if "bitcoin" in titulo_lower or "crypto" in titulo_lower:
                            target_asset = "bitcoin"
                        elif "s&p" in titulo_lower or "stock" in titulo_lower or "economy" in titulo_lower:
                            target_asset = "sp500" 
                        else: 
                            target_asset = "general_macro"
                        
                        mensaje = {
                            "source": article['source']['name'],
                            "title": titulo,
                            "description": article.get('description', ''),
                            "published_at": article['publishedAt'],
                            "asset_type": "macro" ,
                            "target": target_asset
                        }
                        
                        producer.produce(
                            KAFKA_TOPIC, 
                            json.dumps(mensaje).encode('utf-8'), 
                            callback=delivery_report
                        )
                        
                        titulares_enviados.add(titulo)
                        nuevos_enviados += 1
                        
                        # 🔥 Si ya encontramos 5 noticias NUEVAS de alto impacto, paramos este lote
                        if nuevos_enviados >= 5:
                            break
                    
                    producer.poll(0)
                    logger.info(f"⏳ Lote procesado ({nuevos_enviados} noticias nuevas). Esperando {INTERVAL}s...")
                else:
                    logger.error(f"⚠️ Error en NewsAPI: {response.status_code}")
            
            except Exception as e:
                logger.error(f"⚠️ Error en el bucle: {e}")

            time.sleep(INTERVAL)

    except KeyboardInterrupt:
        logger.info("\n🛑 Deteniendo productor de noticias...")
    finally:
        producer.flush()

if __name__ == '__main__':
    run_producer()