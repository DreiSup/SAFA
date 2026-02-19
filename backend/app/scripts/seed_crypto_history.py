import os
import requests
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv

# 1. CARGAR ENTORNO
env_path = Path(os.getcwd()) / '.env'
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv('MONGO_URI')
if not MONGO_URI:
    MONGO_URI = 'mongodb://ysst:ysst@localhost:27020/'


DB_NAME = 'safa_macro'
COLLECTION_NAME = 'bitcoin_prices'

# Binance Klines API: BTC/USDT, intervalos de 1 hora, máximo 720 velas (30 días * 24 horas)
BINANCE_KLINES_URL = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=720"

def seed_historical_data():
    print("Iniciando descarga de histórico de Bitcoin (Últimos 30 días)...")

    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    try: 
        response = requests.get(BINANCE_KLINES_URL)
        response.raise_for_status()
        klines = response.json()

        historical_docs = []

        # 3. Formatear los datos
        # Binance devuelve un array puro. El índice 4 es el precio de Cierre (Close)
        # El índice 6 es el tiempo de cierre (Close time) en milisegundos
        for kline in klines:
            doc = {
                "asset": "Bitcoin",
                "symbol": "BTC/USDT",
                "price": float(kline[4]),           # Precio de cierre
                "timestamp": float(kline[6]) / 1000.0, # Convertir ms a segundos
                "source": "Binance Historical 1h"
            }
            historical_docs.append(doc)

        # 4. Insertar de golpe en MongoDB (Bulk Insert)
        if historical_docs:
            # Opcional: Limpiar la colección antes para no duplicar si ejecutas esto varias veces
            # collection.delete_many({"source": "Binance Historical 1h"}) 
            
            collection.insert_many(historical_docs)
            print(f"✅ ¡Éxito! Se han guardado {len(historical_docs)} registros históricos en MongoDB.")

    except Exception as e:
        print(f"❌ Error durante la siembra de datos: {e}")
    finally:
        client.close()

if __name__ == '__main__':
    seed_historical_data()