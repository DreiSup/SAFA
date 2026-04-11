import os
from flask import Flask
from .extensions import db, mongo, socketio
from dotenv import load_dotenv
from flask_cors import CORS
from flasgger import Swagger
from .swagger_config import swagger_config, swagger_template

# Importar modelos para que SQLAlchemy los registre al arrancar
from .models.transaction import Transaccion

def create_app():
    load_dotenv()
    
    app = Flask(__name__)

    # Configuración
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["MONGO_URI"] = os.getenv('MONGO_URI')

    # Inicializar Extensiones
    db.init_app(app)
    mongo.init_app(app)

    # cors_allowed_origins="*" es VITAL para que React (que corre en otro puerto) pueda conectarse
    socketio.init_app(app, cors_allowed_origins="*")

    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"]
        }
    }, supports_credentials=True)

    Swagger(app, config=swagger_config, template=swagger_template)

    # Crear tablas automáticamente si no existen, SQLAlchemy (Solo desarrollo)
    with app.app_context():
        db.create_all()


    # Registrar Blueprints (Las Rutas)
    from .routes.core import core_bp
    app.register_blueprint(core_bp)

    from .routes.macro_routes import macro_bp
    app.register_blueprint(macro_bp)
    
    # Aquí registraremos finance_bp
    from .routes.finance import finance_bp
    app.register_blueprint(finance_bp)

    from .websockets import emit_real_time_price, init_websockets
    init_websockets()
    socketio.start_background_task(emit_real_time_price, 'crypto_prices', 'update_btc')
    socketio.start_background_task(emit_real_time_price, 'stock_prices', 'update_sp500')

    # Archivo candle_scheduler, cada 1h y 1d agrega la candle correspondiente a la db
    from .repositories.mongo_repository import ensure_candle_index
    from .scripts.candle_scheduler import init_scheduler
    ensure_candle_index()
    init_scheduler()

    return app