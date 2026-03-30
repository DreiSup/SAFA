import os
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from pymongo import MongoClient
# Importamos los esquemas de Marshmallow
from app.schemas.macro_schema import bitcoin_list_schema, sp500_list_schema, candle_list_schema
from app.repositories.mongo_repository import get_sentiment_summary
from app.utils.logger_setup import get_logger

logger = get_logger("Macro_routes")

macro_bp = Blueprint('macro', __name__, url_prefix='/api/v1/macro')

# Conexión a MongoDB (usando la variable de entorno o el puerto 27020 por defecto)
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://ysst:ysst@localhost:27020/')
client = MongoClient(MONGO_URI)
db = client['safa_macro']
collection_prices = db['prices']       # colección legacy (no borrar hasta migrar)
collection_ticks = db['prices_ticks']  # ticks en tiempo real (TTL 48h)
collection_candles = db['prices_candles']  # velas OHLCV históricas


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

@macro_bp.route('/bitcoin', methods=['GET'])
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
    

@macro_bp.route('/bitcoin/recent', methods=['GET'])
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
        today = request.args.get('today', default=False, type=lambda v: v == 'true')

        query = {"asset": "Bitcoin"}
        if today:
            start_of_day = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
            query["timestamp"] = {"$gte": start_of_day}

        # Consultar prices_ticks (datos en tiempo real, TTL 48h)
        cursor = collection_ticks.find(query).sort("timestamp", -1).limit(limit)
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
        today = request.args.get('today', default=False, type=lambda v: v == 'true')

        query = {"asset": "S&P 500"}
        if today:
            start_of_day = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0).timestamp()
            query["timestamp"] = {"$gte": start_of_day}

        # Consultar prices_ticks (datos en tiempo real, TTL 48h)
        cursor = collection_ticks.find(query).sort("timestamp", -1).limit(limit)
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


@macro_bp.route('/bitcoin/candles', methods=['GET'])
def get_bitcoin_candles():
    """ Obtener velas OHLCV de Bitcoin desde prices_candles.
     ---
    tags:
       - Macroeconomia
    summary: Devuelve velas históricas OHLCV de Bitcoin.
    responses:
      200:
        description: Lista de velas devuelta exitosamente.
      500:
        description: Error interno del servidor.
    """
    try:
        limit = request.args.get('limit', default=720, type=int)  # 720 = 30 días de velas 1h

        cursor = collection_candles.find(
            {"asset": "Bitcoin"},
            {"_id": 0}
        ).sort("timestamp_open", 1).limit(limit)

        raw_data = list(cursor)
        result = candle_list_schema.dump(raw_data)

        return jsonify({"status": "success", "count": len(result), "data": result}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@macro_bp.route('/sp500/candles', methods=['GET'])
def get_sp500_candles():
    """ Obtener velas OHLCV del S&P500 desde prices_candles.
     ---
    tags:
       - Macroeconomia
    summary: Devuelve velas históricas OHLCV del S&P500.
    responses:
      200:
        description: Lista de velas devuelta exitosamente.
      500:
        description: Error interno del servidor.
    """
    try:
        limit = request.args.get('limit', default=720, type=int)

        cursor = collection_candles.find(
            {"asset": "S&P 500"},
            {"_id": 0}
        ).sort("timestamp_open", 1).limit(limit)

        raw_data = list(cursor)
        result = candle_list_schema.dump(raw_data)

        return jsonify({"status": "success", "count": len(result), "data": result}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500