import requests
from datetime import datetime
from app.utils.logger_setup import get_logger 
from app.repositories.mongo_repository import upsert_candle
from apscheduler.schedulers.background import BackgroundScheduler 


logger = get_logger(__name__)

def fetch_and_store_candle(symbol, interval, asset_name):
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
        logger.error(f"Error al intentar hacer fetch de candle {symbol} {interval}: {str(e)}")



def init_scheduler():
    scheduler = BackgroundScheduler()

    scheduler.add_job(fetch_and_store_candle, "cron", minute=1, args=["BTCUSDT", "1h", "Bitcoin"])
    scheduler.add_job(fetch_and_store_candle, "cron", hour=0, minute=1, args=["BTCUSDT", "1d", "Bitcoin"])
    scheduler.add_job(fetch_and_store_candle, "cron", second=1, args=["BTCUSDT", "1m", "Bitcoin"])
    
    scheduler.start()
    logger.info("candle_scheduler iniciado")