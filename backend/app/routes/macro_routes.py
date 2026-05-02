import os
import time
from flask import Blueprint, jsonify, request
from pymongo import MongoClient
from app.schemas.macro_schema import bitcoin_list_schema, sp500_list_schema, candle_list_schema, price_tick_schema
from app.repositories.mongo_repository import get_sentiment_summary
from app.utils.logger_setup import get_logger
from datetime import datetime, timezone

logger = get_logger("Macro_routes")

macro_bp = Blueprint('macro', __name__, url_prefix='/api/v1/macro')

# Conexión a MongoDB (usando la variable de entorno o el puerto 27020 por defecto)
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://ysst:ysst@localhost:27020/')
client = MongoClient(MONGO_URI)
db = client['safa_macro']
collection_candles = db['prices_candles']
collection_ticks = db['prices_ticks']


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
        interval = request.args.get('interval', default='1h')

        cursor = collection_candles.find(
            {"symbol": "BTCUSDT", "interval": interval}
        ).sort("timestamp_open", 1).limit(limit)

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
        }), 500
    
@macro_bp.route('/btc/ticks', methods=['GET'])
def getBTCTicks():
    """ Obtener ticks de precios recientes de BTC.
        ---
        tags: 
        - Macroeconomia
        summary: Devuelve ticks de BTC, 30 ticks por defecto.
        description: Extrae los datos de MongoDB, los valida con Marshmallow y los sirve para renderizar gráficos.
        responses:
        200:
            description: Lista de precios de BTC devuelta exitosamente.
        500:
            description: Error interno del servidor.
    """

    try:
        #cambiar límite a futuro
        limit = request.args.get('limit', default=30, type=int)
        
        cursor = collection_ticks.find(
            {"symbol": "BTCUSDT"}
        ).sort("timestamp", 1).limit(limit)

        raw_data = list(cursor)

        logger.info(f"RAW DATA: {raw_data}")

        result = price_tick_schema.dump(raw_data)

        """ logger.info(f"RESULT: {raw_data}") """

        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al obtener datos: {str(e)}"
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
        interval = request.args.get('interval', default='1h')

        cursor = collection_candles.find(
            {"symbol": "SPY", "interval": interval}
        ).sort("timestamp_open", 1).limit(limit)

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
        }), 500
    
@macro_bp.route('/sp500/ticks', methods=['GET'])
def getSP500Ticks():
    """ Obtener ticks de precios recientes de SP500.
        ---
        tags: 
        - Macroeconomia
        summary: Devuelve ticks de SP500, 30 ticks por defecto.
        description: Extrae los datos de MongoDB, los valida con Marshmallow y los sirve para renderizar gráficos.
        responses:
        200:
            description: Lista de precios de BTC devuelta exitosamente.
        500:
            description: Error interno del servidor.
    """

    try:
        #cambiar límite a futuro
        limit = request.args.get('limit', default=30, type=int)
        
        cursor = collection_ticks.find(
            {"symbol": "SPY"}
        ).sort("timestamp", 1).limit(limit)

        raw_data = list(cursor)

        result = price_tick_schema.dump(raw_data)

        return jsonify({
            "status": "success",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Error al obtener datos: {str(e)}"
        }), 500