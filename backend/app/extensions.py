from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from flask_socketio import SocketIO

# Inicializamos las extensiones vacías
db = SQLAlchemy()
mongo = PyMongo()

socketio = SocketIO()