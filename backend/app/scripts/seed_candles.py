import os
import requests
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient

from app.utils.logger_setup import get_logger

load_dotenv(dotenv_path=Path(os.getcwd()) / '.env')

logger = get_logger(__name__)

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://ysst:ysst@localhost:27020/')
DB_NAME = 'safa_macro'
COLLECTION = 'prices_candles'

ALPACA_HEADERS = {
    "APCA-API-KEY-ID": os.getenv("ALPACA_API_KEY"),
    "APCA-API-SECRET-KEY": os.getenv("ALPACA_SECRET_KEY"),
}

INTERVAL_TO_ALPACA = {"1m": "1Min", "1h": "1Hour", "1d": "1Day"}
INTERVAL_DURATION = {"1m": 60, "1h": 3600, "1d": 86400}

JOBS = [
    {"api": "binance", "symbol": "BTCUSDT", "asset": "Bitcoin", "interval": "1m", "limit": 1440},  # últimas ~16h
    {"api": "binance", "symbol": "BTCUSDT", "asset": "Bitcoin", "interval": "1h", "limit": 720},   # última semana
    {"api": "binance", "symbol": "BTCUSDT", "asset": "Bitcoin", "interval": "1d", "limit": 365},    # último mes
    {"api": "alpaca",  "symbol": "SPY",     "asset": "SP500",   "interval": "1m", "limit": 1440},   # último día de mercado (~6.5h)
    {"api": "alpaca",  "symbol": "SPY",     "asset": "SP500",   "interval": "1h", "limit": 720},   # ~1 mes de horas de mercado
    {"api": "alpaca",  "symbol": "SPY",     "asset": "SP500",   "interval": "1d", "limit": 365},    # último mes
]


def fetch_binance_klines(symbol, interval, limit):
    resp = requests.get(
        "https://api.binance.com/api/v3/klines",
        params={"symbol": symbol, "interval": interval, "limit": limit},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def binance_kline_to_doc(kline, symbol, interval, asset):
    return {
        "asset": asset,
        "symbol": symbol,
        "interval": interval,
        "open": float(kline[1]),
        "high": float(kline[2]),
        "low": float(kline[3]),
        "close": float(kline[4]),
        "volume": float(kline[5]),
        "timestamp_open": float(kline[0]) / 1000.0,
        "timestamp_close": float(kline[6]) / 1000.0,
        "quote_volume": float(kline[7]),
        "trades": int(kline[8]),
        "taker_buy_volume": float(kline[9]),
        "taker_buy_quote_volume": float(kline[10]),
        "source": f"Binance Seed {interval}",
    }


def fetch_alpaca_bars(symbol, interval, limit):
    alpaca_interval = INTERVAL_TO_ALPACA[interval]
    resp = requests.get(
        f"https://data.alpaca.markets/v2/stocks/{symbol}/bars",
        params={"timeframe": alpaca_interval, "limit": limit, "feed": "iex"},
        headers=ALPACA_HEADERS,
        timeout=10,
    )
    resp.raise_for_status()

    candles = resp.json()["bars"]

    if candles is None:
        return []
    else:
        return candles


def alpaca_bar_to_doc(bar, symbol, interval, asset):
    ts_open = datetime.fromisoformat(bar["t"].replace("Z", "+00:00")).timestamp()
    ts_close = ts_open + INTERVAL_DURATION[interval] - 0.001
    return {
        "asset": asset,
        "symbol": symbol,
        "interval": interval,
        "open": float(bar["o"]),
        "high": float(bar["h"]),
        "low": float(bar["l"]),
        "close": float(bar["c"]),
        "volume": float(bar["v"]),
        "timestamp_open": ts_open,
        "timestamp_close": ts_close,
        "trades": int(bar["n"]),
        "source": f"Alpaca Seed {interval}",
    }


def existing_timestamps(collection, symbol, interval):
    docs = collection.find(
        {"symbol": symbol, "interval": interval},
        {"timestamp_open": 1, "_id": 0},
    )
    return {d["timestamp_open"] for d in docs}


def run():
    client = MongoClient(MONGO_URI)
    collection = client[DB_NAME][COLLECTION]

    for job in JOBS:
        symbol, asset, interval, limit, api = (
            job["symbol"], job["asset"], job["interval"], job["limit"], job["api"]
        )
        logger.info(f"Descargando {limit} velas {interval} de {symbol} ({api})...")
        try:
            if api == "binance":
                raw = fetch_binance_klines(symbol, interval, limit)
                docs = [binance_kline_to_doc(k, symbol, interval, asset) for k in raw]
            else:
                raw = fetch_alpaca_bars(symbol, interval, limit)
                docs = [alpaca_bar_to_doc(b, symbol, interval, asset) for b in raw]

            already_in_db = existing_timestamps(collection, symbol, interval)
            new_docs = [d for d in docs if d["timestamp_open"] not in already_in_db]

            if not new_docs:
                logger.info(f"{symbol} {interval}: todo ya estaba en DB, nada que insertar")
                continue

            collection.insert_many(new_docs, ordered=False)
            logger.info(f"{symbol} {interval}: {len(new_docs)} nuevas insertadas, {len(docs) - len(new_docs)} omitidas")
        except Exception as e:
            logger.error(f"Error en {symbol} {interval}: {e}")

    client.close()
    logger.info("Seed completado.")


if __name__ == "__main__":
    run()
