import os
from flask import Blueprint, jsonify, request
from pymongo import MongoClient
# Importamos los esquemas de Marshmallow
from app.schemas.macro_schema import bitcoin_list_schema, sp500_list_schema, candle_list_schema
from app.repositories.mongo_repository import get_sentiment_summary
from app.utils.logger_setup import get_logger
from datetime import datetime, timezone

logger = get_logger("Macro_routes")

macro_bp = Blueprint('macro', __name__, url_prefix='/api/v1/macro')

# Conexión a MongoDB (usando la variable de entorno o el puerto 27020 por defecto)
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://ysst:ysst@localhost:27020/')
client = MongoClient(MONGO_URI)
db = client['safa_macro']
collection_prices = db['prices']
collection_candles = db['prices_candles']


@macro_bp.route('/sentiment', methods=['GET'])
def get_sentiment():
    """ Obtener sentimiento agregado del mercado.
     ---
    tags:
       - Macroeconomia
    summary: Sentimiento ponderado por calidad/fuente para bitcoin, sp500 y general_macro.
    responses:
      200:
        description: Sentimiento calculado exitosamente.
      500:
        description: Error interno del servidor.
    """
    try:
        since_hours = request.args.get('since', default=24, type=int)
        result = get_sentiment_summary('sentiment_news', since_hours=since_hours)
        return jsonify({
            "status": "success",
            "since_hours": since_hours,
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al calcular el sentimiento: {str(e)}"
        }), 500

@macro_bp.route('/btc', methods=['GET'])
def get_bitcoin_history():
    """ Obtener histórico de precios de Bitcoin.
     ---
    tags: 
       - Macroeconomia
    summary: Devuelve la serie temporal de precios de Bitcoin.
    description: Extrae los datos de MongoDB, los valida con Marshmallow y los sirve para renderizar gráficos.
    responses:
      200:
        description: Lista de precios de Bitcoin devuelta exitosamente.
      500:
        description: Error interno del servidor.
          """
    
    try: 
        # 1. Consultar Mongo: Buscamos todo, ordenado por timestamp (1 = ascendente, más antiguo primero)
        # Ponemos un límite de 1000 por seguridad para no colapsar la memoria de React de golpe
        cursor = collection_prices.find({"asset":"Bitcoin"}).sort("timestamp", 1).limit(1000)
        raw_data = list(cursor)

        # 2. La magia de Marshmallow: Limpia los ObjectIds y valida los tipos de datos
        result = bitcoin_list_schema.dump(raw_data)

        # 3. Respuesta limpia y estructurada
        return jsonify({
            "status": "success",
            "count": len(result),
            "data": result
        }), 200

    except Exception as e: 
        return jsonify({
            "status": "error",
            "message": f"Error al obtener los datos: {str(e)}"
        }), 500
    

@macro_bp.route('/btc/recent', methods=['GET'])
def get_recent_bitcoin():
    """ Obtener precios recientes de Bitcoin.
     ---
    tags: 
       - Macroeconomia
    summary: Devuelve últimos precios de Bitcoin, 30d por defecto.
    description: Extrae los datos de MongoDB, los valida con Marshmallow y los sirve para renderizar gráficos.
    responses:
      200:
        description: Lista de precios de Bitcoin devuelta exitosamente.
      500:
        description: Error interno del servidor.
          """
    
    try: 

        limit = request.args.get('limit', default=30, type=int)

        # Consultar Mongo: Buscamos todo, ordenado por timestamp (1 = ascendente, más antiguo primero)
        cursor = collection_prices.find({"asset": "Bitcoin"}).sort("timestamp", -1).limit(limit)
        raw_data = list(cursor)

        # Invertimos data para que el grafico pinte de izq a der
        raw_data.reverse()

        # Marshmallow: Limpia los ObjectIds y valida los tipos de datos
        result = bitcoin_list_schema.dump(raw_data)

        logger.info(result)

        # 3. Respuesta limpia y estructurada
        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except Exception as e: 
        return jsonify({
            "status": "error",
            "message": f"Error al obtener los datos: {str(e)}"
        }), 500
    
@macro_bp.route('/btc/candles', methods=['GET'])
def getBTCCandles():

    """ Obtener precios recientes de BTC.
        ---
        tags: 
        - Macroeconomia
        summary: Devuelve candles de BTC, 30 velas por defecto.
        description: Extrae los datos de MongoDB, los valida con Marshmallow y los sirve para renderizar gráficos.
        responses:
        200:
            description: Lista de precios de BTC devuelta exitosamente.
        500:
            description: Error interno del servidor.
            """
    try:

        limit = request.args.get('limit', default=30, type=int)

        cursor = collection_candles.find({"symbol": "BTCUSDT"}).sort("timestamp_open", 1).limit(limit)
        raw_data = list(cursor)

        print("RAW DATAAAA:", raw_data)

        # Marshmallow: Limpia los ObjectIds y valida los tipos de datos
        result = candle_list_schema.dump(raw_data)

        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al obtener datos: {str(e)}"
        })


@macro_bp.route('/sp500', methods=['GET'])
def get_sp500_history():
    """ Obtener histórico de precios de S&P500.
     ---
    tags: 
       - Macroeconomia
    summary: Devuelve la serie temporal de precios de S&P500.
    description: Extrae los datos de MongoDB, los valida con Marshmallow y los sirve para renderizar gráficos.
    responses:
      200:
        description: Lista de precios de S&P500 devuelta exitosamente.
      500:
        description: Error interno del servidor.
          """
    
    try: 
        # 1. Consultar Mongo: Buscamos todo, ordenado por timestamp (1 = ascendente, más antiguo primero)
        # Ponemos un límite de 1000 por seguridad para no colapsar la memoria de React de golpe
        cursor = collection_prices.find({"asset": "S&P 500"}).sort("timestamp", 1).limit(1000)
        raw_data = list(cursor)

        # 2. La magia de Marshmallow: Limpia los ObjectIds y valida los tipos de datos
        result = sp500_list_schema.dump(raw_data)

        # 3. Respuesta limpia y estructurada
        return jsonify({
            "status": "success",
            "count": len(result),
            "data": result
        }), 200

    except Exception as e: 
        return jsonify({
            "status": "error",
            "message": f"Error al obtener los datos: {str(e)}"
        }), 500


@macro_bp.route('/sp500/recent', methods=['GET'])
def get_recent_sp500():
    """ Obtener precios recientes de SP500.
     ---
    tags: 
       - Macroeconomia
    summary: Devuelve últimos precios de SP500, 30d por defecto.
    description: Extrae los datos de MongoDB, los valida con Marshmallow y los sirve para renderizar gráficos.
    responses:
      200:
        description: Lista de precios de SP500 devuelta exitosamente.
      500:
        description: Error interno del servidor.
    """
    
    try: 

        limit = request.args.get('limit', default=30, type=int)

        # Consultar Mongo: Buscamos todo, ordenado por timestamp (1 = ascendente, más antiguo primero)
        cursor = collection_prices.find({"asset": "S&P 500"}).sort("timestamp", -1).limit(limit)
        raw_data = list(cursor)

        # Invertimos data para que el grafico pinte de izq a der
        raw_data.reverse()

        # Marshmallow: Limpia los ObjectIds y valida los tipos de datos
        result = sp500_list_schema.dump(raw_data)

        logger.info(result)

        # 3. Respuesta limpia y estructurada
        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except Exception as e: 
        return jsonify({
            "status": "error",
            "message": f"Error al obtener los datos: {str(e)}"
        }), 500
    
@macro_bp.route('/sp500/candles', methods=['GET'])
def getSP500Candles():

    """ Obtener precios recientes de SP500.
        ---
        tags: 
        - Macroeconomia
        summary: Devuelve candles de SP500, 30 velas por defecto.
        description: Extrae los datos de MongoDB, los valida con Marshmallow y los sirve para renderizar gráficos.
        responses:
        200:
            description: Lista de precios de SP500 devuelta exitosamente.
        500:
            description: Error interno del servidor.
            """
    try:

        limit = request.args.get('limit', default=30, type=int)

        cursor = collection_candles.find({"symbol": "SPY"}).sort("timestamp_open", 1).limit(limit)
        raw_data = list(cursor)

        # Marshmallow: Limpia los ObjectIds y valida los tipos de datos
        result = candle_list_schema.dump(raw_data)

        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al obtener datos: {str(e)}"
        })