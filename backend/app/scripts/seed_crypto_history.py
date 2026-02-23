import os
import requests
from pathlib import Path
from pymongo import MongoClient
from dotenv import load_dotenv
from pymongo import UpdateOne

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

        # 4. Inserción Inteligente (Bulk Upsert)
        if historical_docs:
            print(f"🔄 Procesando {len(historical_docs)} registros. Evitando duplicados...")
            
            # Preparamos una lista de operaciones
            operations = []
            for doc in historical_docs:
                # Definimos la regla: Buscar por Símbolo y Timestamp
                filtro_busqueda = {
                    "symbol": doc["symbol"], 
                    "timestamp": doc["timestamp"]
                }
                
                # UpdateOne(filtro, datos_nuevos, upsert=True)
                # Si lo encuentra, lo actualiza ($set). Si no lo encuentra, lo inserta.
                operacion = UpdateOne(
                    filtro_busqueda,
                    {"$set": doc},
                    upsert=True
                )
                operations.append(operacion)

            # Ejecutamos todas las operaciones de golpe por eficiencia
            resultado = collection.bulk_write(operations)
            
            print(f"✅ Completado:")
            print(f"   - Nuevos insertados: {resultado.upserted_count}")
            print(f"   - Existentes actualizados: {resultado.modified_count}")
        
    except Exception as e:
        print(f"❌ Error durante la siembra de datos: {e}")
    finally:
        client.close()

if __name__ == '__main__':
    seed_historical_data()