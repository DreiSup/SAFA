import os
from flask import Flask
from .extensions import db, mongo
from dotenv import load_dotenv
from flask_cors import CORS

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

    CORS(app)

    # Crear tablas automáticamente (Solo desarrollo)
    with app.app_context():
        db.create_all()

    # Registrar Blueprints (Las Rutas)
    from .routes.core import core_bp
    app.register_blueprint(core_bp)
    
    # Aquí registraremos finance_bp
    from .routes.finance import finance_bp
    app.register_blueprint(finance_bp)

    return app