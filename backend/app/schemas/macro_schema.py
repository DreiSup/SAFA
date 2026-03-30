from marshmallow import Schema, fields, validate, ValidationError

class BitcoinPriceSchema(Schema): 
    """
    Esquema para serializar los datos de precios de Bitcoin que vienen de MongoDB.
    Documentación para Swagger incluida.
    """
    # Excluimos el _id de Mongo porque a React no le importa y a Python le da error al serializarlo
    asset = fields.Str(dump_default="Bitcoin", metadata={"description": "Nombre del activo"})
    symbol = fields.Str(dump_default="BTC/USDT", metadata={"description": "Par de trading"})
    price = fields.Float(required=True, metadata={"description": "Precio de cierre"})
    timestamp = fields.Float(required=True, metadata={"description": "Marca de tiempo en segundos (Unix)"})
    source = fields.Str(metadata={"description": "Origen de los datos (ej. Binance Historical)"})

# Instanciamos el esquema para devolver listas de precios (many=True)
bitcoin_list_schema = BitcoinPriceSchema(many=True)


class SP500PriceSchema(Schema):
    """
    Esquema para serializar los datos históricos del S&P500.
    """
    asset = fields.Str(dump_default="S&P 500", metadata={"description": "Nombre del índice"})
    symbol = fields.Str(dump_default="^GSPC", metadata={"description": "Ticker de Yahoo Finance"})
    price = fields.Float(required=True, metadata={"description": "Precio de cierre"})
    timestamp = fields.Float(required=True, metadata={"description": "Marca de tiempo en segundos (Unix)"})
    source = fields.Str(metadata={"description": "Origen de los datos (ej. Yahoo Finance)"})

sp500_list_schema = SP500PriceSchema(many=True)


class CandleSchema(Schema):
    """
    Esquema para velas OHLCV completas.
    Campos comunes: BTC y S&P 500.
    Campos opcionales BTC (Binance): quote_volume, trades, taker_buy_volume, taker_buy_quote_volume.
    Campos opcionales SP500 (yfinance): dividends, stock_splits.
    """
    # --- Campos comunes ---
    asset = fields.Str(required=True)
    symbol = fields.Str(required=True)
    interval = fields.Str(required=True)
    open = fields.Float(required=True)
    high = fields.Float(required=True)
    low = fields.Float(required=True)
    close = fields.Float(required=True)
    volume = fields.Float(required=True)
    timestamp_open = fields.Float(required=True)
    timestamp_close = fields.Float(required=True)
    source = fields.Str()

    # --- Campos exclusivos de Binance (BTC) ---
    quote_volume = fields.Float(load_default=None)          # Volumen en USD durante la vela
    trades = fields.Int(load_default=None)                  # Número de operaciones ejecutadas
    taker_buy_volume = fields.Float(load_default=None)      # BTC comprado por takers (market orders)
    taker_buy_quote_volume = fields.Float(load_default=None) # USD gastado por takers

    # --- Campos exclusivos de yfinance (SP500) ---
    dividends = fields.Float(load_default=None)             # Dividendo por acción en ese período
    stock_splits = fields.Float(load_default=None)          # Ratio de split (0 si no hubo split)

candle_list_schema = CandleSchema(many=True)


class MacroNewsSchema(Schema):
    # Definimos campos exactos y tipos de datos
    source = fields.String(required=True, validate=validate.Length(min=1))
    title = fields.String(required=True, validate=validate.Length(min=5))
    description = fields.String(missing="") # Si no hay descripción, string vacío
    published_at = fields.DateTime(required=True)
    asset_type = fields.String(required=True, validate=validate.OneOf(["macro"]))

    # El target solo puede ser uno de estos tres. SI llega otra cosa, explota aquí y no en la IA
    target = fields.String(
        required=True,
        validate=validate.OneOf(["bitcoin", "sp500", "general_macro"])
    )

    data_source = fields.String(missing="newsapi")  # "newsapi" | "reddit"
    impact_score = fields.Float(missing=0.5)        # 0.0–1.0, peso de calidad/alcance

news_validator = MacroNewsSchema()