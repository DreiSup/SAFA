import json
import time
import requests
from datetime import datetime, timezone
from confluent_kafka import Producer
from app.utils.logger_setup import get_logger

logger = get_logger("Producer_Reddit")

# --- CONFIGURACIÓN ---
KAFKA_TOPIC = 'reddit_ticker'
KAFKA_CONF = {
    'bootstrap.servers': 'localhost:9092',
    'client.id': 'safa-reddit-producer'
}

HEADERS = {"User-Agent": "SAFA-sentiment-fetcher/1.0 (educational project)"}
SORT_BY = "hot"
SUBREDDITS = ['wallstreetbets', 'Bitcoin', 'CryptoCurrency', 'investing']
POSTS_PER_SUBREDDIT = 10
INTERVAL = 30  # 5 min

titulos_enviados = set()
MAX_MEMORIA = 200


def delivery_report(err, msg):
    if err is not None:
        logger.error(f"Error enviando mensaje: {err}")
    else:
        logger.info(f"Post Reddit enviado a Kafka: {msg.value().decode('utf-8')[15:50]}...")


def limpiar_memoria():
    global titulos_enviados
    if len(titulos_enviados) > MAX_MEMORIA:
        titulos_enviados = set(list(titulos_enviados)[-100:])


def clasificar_target(titulo):
    titulo_lower = titulo.lower()
    if "bitcoin" in titulo_lower or "crypto" in titulo_lower or "btc" in titulo_lower:
        return "bitcoin"
    elif "s&p" in titulo_lower or "stock" in titulo_lower or "economy" in titulo_lower or "market" in titulo_lower:
        return "sp500"
    else:
        return "general_macro"


def fetch_subreddit(subreddit: str, sort: str = "hot", limit: int = 10) -> list[dict]:
    url = f"https://www.reddit.com/r/{subreddit}/{sort}.json?limit={limit}"

    try:
        response = requests.get(url, headers=HEADERS, timeout=10)

        if response.status_code == 429:
            logger.warning(f"Rate limit en r/{subreddit}. Esperando 60s...")
            time.sleep(60)
            response = requests.get(url, headers=HEADERS, timeout=10)

        response.raise_for_status()
        raw_posts = response.json()["data"]["children"]

    except requests.exceptions.RequestException as e:
        logger.error(f"Error accediendo a r/{subreddit}: {e}")
        return []

    posts = []
    for item in raw_posts:
        d = item["data"]
        created_at = datetime.fromtimestamp(d["created_utc"], tz=timezone.utc).isoformat()
        posts.append({
            "title":     d["title"],
            "selftext":  d.get("selftext", "").strip(),
            "score":     d["score"],
            "created_at": created_at,
        })

    return posts


def run_producer():
    producer = Producer(KAFKA_CONF)
    logger.info(f"🤖 Productor de Reddit iniciado. Subreddits: {SUBREDDITS}. Intervalo: {INTERVAL}s.")

    try:
        while True:
            limpiar_memoria()
            nuevos_enviados = 0

            for subreddit_name in SUBREDDITS:
                try:
                    posts = fetch_subreddit(subreddit_name, SORT_BY, POSTS_PER_SUBREDDIT)

                    max_score = max((p["score"] for p in posts), default=1) or 1

                    for post in posts:
                        titulo = post["title"]

                        if not titulo or titulo in titulos_enviados:
                            continue

                        impact_score = round(post["score"] / max_score, 4)
                        target_asset = clasificar_target(titulo)

                        mensaje = {
                            "source":       f"r/{subreddit_name}",
                            "title":        titulo,
                            "description":  post["selftext"][:500],
                            "published_at": post["created_at"],
                            "asset_type":   "macro",
                            "target":       target_asset,
                            "data_source":  "reddit",
                            "impact_score": impact_score
                        }

                        producer.produce(
                            KAFKA_TOPIC,
                            json.dumps(mensaje).encode('utf-8'),
                            callback=delivery_report
                        )

                        titulos_enviados.add(titulo)
                        nuevos_enviados += 1

                except Exception as e:
                    logger.error(f"⚠️ Error procesando r/{subreddit_name}: {e}")

                time.sleep(2)  # pausa entre subreddits para respetar rate limit

            producer.poll(0)
            logger.info(f"⏳ Lote Reddit procesado ({nuevos_enviados} posts nuevos). Esperando {INTERVAL}s...")
            time.sleep(INTERVAL)

    except KeyboardInterrupt:
        logger.info("\n🛑 Deteniendo productor de Reddit...")
    finally:
        producer.flush()


if __name__ == '__main__':
    run_producer()
