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

news_validator = MacroNewsSchema()