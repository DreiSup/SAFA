import os
from dotenv import load_dotenv
import requests
from datetime import datetime
from app.utils.logger_setup import get_logger 
from app.repositories.mongo_repository import upsert_candle
from apscheduler.schedulers.background import BackgroundScheduler 

load_dotenv()

logger = get_logger(__name__)

headers = {     
      "APCA-API-KEY-ID": os.getenv("ALPACA_API_KEY"),                                                              
      "APCA-API-SECRET-KEY": os.getenv("ALPACA_SECRET_KEY"),
  } 

INTERVAL_TO_ALPACA = {"1m": "1Min","1h": "1Hour", "1d": "1Day"}
INTERVAL_DURATION = {"1m": 60, "1h": 3600, "1d": 86400}

def fetch_and_store_sp500_candle(symbol, interval, asset_name):
    logger.info(f"Iniciando descarga de candle {symbol} {interval} \n Se ha ejecutado a las {datetime.now()}")

    alpaca_interval = INTERVAL_TO_ALPACA[interval]
    try:
        alpaca_url=f"https://data.alpaca.markets/v2/stocks/SPY/bars?timeframe={alpaca_interval}&limit=1"
        response = requests.get(alpaca_url, headers=headers)
        response.raise_for_status()
        kline = response.json()["bars"][0]

        logger.info(f"KLINE: {kline}")

        timestamp_open = datetime.fromisoformat(kline["t"].replace("Z", "+00:00")).timestamp()

        timestamp_close = timestamp_open + INTERVAL_DURATION[interval] - 0.001

        doc = {
            "asset": asset_name,
            "symbol": "SPY",
            "interval": interval,
            "open": float(kline["o"]),
            "high": float(kline["h"]),
            "low": float(kline["l"]),
            "close": float(kline["c"]),
            "volume": float(kline["v"]),
            "timestamp_open": timestamp_open,
            "timestamp_close": timestamp_close,
            "trades": int(kline["n"]),
            "source": f"Alpaca Historical {interval}"
        }

        upsert_candle("prices_candles", doc)    
        logger.info(f"DOC: {doc}")


    except Exception as e:
        logger.error(f"Error al intentar hacer fetch de SP500 candle {symbol} {interval}: {str(e)}")


def fetch_and_store_btc_candle(symbol, interval, asset_name):
    logger.info(f"Iniciando descarga de candle {symbol} {interval} \n Se ha ejecutado a las {datetime.now()}")

    try:
        binance_url = f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval={interval}&limit=1"
        response = requests.get(binance_url)
        response.raise_for_status()
        kline = response.json()[0]
        
        doc = {
            "asset": asset_name,
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
            "source": f"Binance Historical {interval}"
        }

        upsert_candle("prices_candles", doc)
        logger.info(f"Candle {symbol} {interval}, close:{doc['close']}, guardada correctamente")

    except Exception as e:
        logger.error(f"Error al intentar hacer fetch de BTC candle {symbol} {interval}: {str(e)}")



def init_scheduler():
    scheduler = BackgroundScheduler()

    #anteriormente eliminadas las velas de 1m, se utiliza prices_ticks
    scheduler.add_job(fetch_and_store_btc_candle, "cron", second=1, args=["BTCUSDT", "1m", "Bitcoin"])
    scheduler.add_job(fetch_and_store_btc_candle, "cron", minute=1, args=["BTCUSDT", "1h", "Bitcoin"])
    scheduler.add_job(fetch_and_store_btc_candle, "cron", hour=0, minute=1, args=["BTCUSDT", "1d", "Bitcoin"])

    scheduler.add_job(fetch_and_store_sp500_candle, "cron",  second=1, args=["SPY", "1m", "SP500"])
    scheduler.add_job(fetch_and_store_sp500_candle, "cron",  minute=1, args=["SPY", "1h", "SP500"])
    scheduler.add_job(fetch_and_store_sp500_candle, "cron", hour=0, minute=1, args=["SPY", "1d", "SP500"])
    
    scheduler.start()
    logger.info("candle_scheduler iniciado")