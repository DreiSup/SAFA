import json
from datetime import datetime, timezone
from confluent_kafka import Producer
from app.utils.logger_setup import get_logger

logger = get_logger("Producer_Mock")

KAFKA_CONF = {
    'bootstrap.servers': 'localhost:9092',
    'client.id': 'safa-mock-producer'
}

MOCK_POSTS = [
    {
        "source": "r/wallstreetbets",
        "title": "Bitcoin just broke 70k resistance, next stop 80k",
        "description": "We are seeing strong bullish momentum in BTC after breaking the key 70k level. Volume is confirming the move.",
        "published_at": datetime.now(timezone.utc).isoformat(),
        "asset_type": "macro",
        "target": "bitcoin",
        "data_source": "reddit",
        "impact_score": 0.9
    },
    {
        "source": "r/CryptoCurrency",
        "title": "Fed signals potential rate cut, crypto markets rally hard",
        "description": "Federal Reserve hints at cutting rates in Q2. Bitcoin and altcoins surging across the board as risk assets benefit.",
        "published_at": datetime.now(timezone.utc).isoformat(),
        "asset_type": "macro",
        "target": "general_macro",
        "data_source": "reddit",
        "impact_score": 0.85
    },
    {
        "source": "r/investing",
        "title": "S&P500 hits all time high amid strong earnings season",
        "description": "Major tech companies beat earnings expectations. S&P500 closes at record levels driven by AI sector strength.",
        "published_at": datetime.now(timezone.utc).isoformat(),
        "asset_type": "macro",
        "target": "sp500",
        "data_source": "reddit",
        "impact_score": 0.8
    },
    {
        "source": "r/Bitcoin",
        "title": "BlackRock Bitcoin ETF sees record inflows this week",
        "description": "Institutional demand for BTC continues to grow. BlackRock ETF recorded its highest weekly inflow since launch.",
        "published_at": datetime.now(timezone.utc).isoformat(),
        "asset_type": "macro",
        "target": "bitcoin",
        "data_source": "reddit",
        "impact_score": 0.95
    },
    {
        "source": "r/wallstreetbets",
        "title": "Recession fears grow as unemployment data disappoints",
        "description": "Latest jobs report came in well below expectations. Markets pricing in higher probability of recession in 2025.",
        "published_at": datetime.now(timezone.utc).isoformat(),
        "asset_type": "macro",
        "target": "sp500",
        "data_source": "reddit",
        "impact_score": 0.75
    },
    {
        "source": "r/CryptoCurrency",
        "title": "Crypto market down 8% as regulatory crackdown fears return",
        "description": "SEC announces new enforcement actions against major exchanges. BTC drops sharply as uncertainty grows.",
        "published_at": datetime.now(timezone.utc).isoformat(),
        "asset_type": "macro",
        "target": "bitcoin",
        "data_source": "reddit",
        "impact_score": 0.88
    },
]


def delivery_report(err, msg):
    if err is not None:
        logger.error(f"Error enviando mensaje: {err}")
    else:
        logger.info(f"Mock post enviado → topic={msg.topic()} | {msg.value().decode('utf-8')[:60]}...")


def run_producer():
    producer = Producer(KAFKA_CONF)
    logger.info(f"Enviando {len(MOCK_POSTS)} posts mock a Kafka (topic: reddit_ticker)...")

    for post in MOCK_POSTS:
        producer.produce(
            'reddit_ticker',
            json.dumps(post).encode('utf-8'),
            callback=delivery_report
        )

    producer.flush()
    logger.info("Todos los posts mock enviados correctamente.")


if __name__ == '__main__':
    run_producer()
