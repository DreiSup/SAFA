import os
import yfinance as yf
from pymongo import MongoClient, UpdateOne
import pandas as pd

# Conexión a MongoDB (la misma que usamos para Bitcoin)
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://ysst:ysst@localhost:27020/')
client = MongoClient(MONGO_URI)
db = client['safa_macro']
collection = db['sp500_prices'] # <-- Nueva colección

def seed_sp500():
    print("Iniciando descarga de datos históricos del S&P500...")

    try:
        # 1. Descargar datos de Yahoo Finance (Último mes, intervalo diario o de 1 hora)
        # ^GSPC es el símbolo del S&P 500 en Yahoo
        sp500 = yf.Ticker("^GSPC")

        # Descargamos el último mes en intervalos de 1 hora para tener granularidad
        hist = sp500.history(period="1mo", interval="1h")

        if hist.empty:
            print("No se han encontrado datos. Algo ha ido mal.")
            return
        
        # 2. Formatear los datos para que coincidan con nuestra arquitectura
        historical_docs = []
        for index, row in hist.iterrows():
            # Convertimos el índice (fecha) a timestamp Unix (segundos)
            timestamp = int(index.timestamp())

            doc = {
                "asset": "S&P 500",
                "symbol": "^GSPC",
                "price": float(row['Close']),
                "timestamp": timestamp,
                "source": "Yahoo Finance"
            }
            historical_docs.append(doc)

        # 3. Inserción Inteligente (Bulk Upsert para evitar duplicados)
        if historical_docs:
            print(f"🔄 Procesando {len(historical_docs)} registros del SP500...")
            operations = []
            
            for doc in historical_docs:
                filtro_busqueda = {
                    "symbol": doc["symbol"], 
                    "timestamp": doc["timestamp"]
                }
                
                operacion = UpdateOne(
                    filtro_busqueda,
                    {"$set": doc},
                    upsert=True
                )
                operations.append(operacion)
            
            resultado = collection.bulk_write(operations)

            print(f"✅ Completado con éxito:")
            print(f"   - Nuevos insertados: {resultado.upserted_count}")
            print(f"   - Existentes actualizados: {resultado.modified_count}")

    except Exception as e: 
        print(f"❌ Error durante la siembra: {e}")

if __name__ == "__main__":
    seed_sp500()