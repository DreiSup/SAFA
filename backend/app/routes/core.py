from flask import Blueprint, jsonify
from sqlalchemy import text
from app.extensions import db, mongo
import socket
from kafka import KafkaProducer

# Definimos el Blueprint (un grupo de rutas)
core_bp = Blueprint('core', __name__)

@core_bp.route('/')
def home():
    return jsonify({"status": "SAFA Backend Running", "mode": "Modular"})

@core_bp.route('/health')
def health_check():
    status = {
        "postgres": "Down 🔴",
        "mongo": "Down 🔴",
        "kafka": "Down 🔴",
        "zookeeper": "Down 🔴"
    }
    
    #VERIFICAR POSTGRES
    try:
        db.session.execute(text('SELECT 1'))
        status["postgres"] = "OK 🟢"
    except Exception as e:
        status["postgres"] = f"FAIL 🔴: {str(e)}"

    #VERIFICAR MONGO
    try:
        mongo.cx.admin.command('ping')
        status["mongo"] = "OK 🟢"
    except Exception as e:
            status["mongo"] = f"FAIL 🔴: {str(e)}"
    
    #VERIFICAR KAFKA
    try:
        # Intentamos una conexión rápida al broker
        producer = KafkaProducer(
            bootstrap_servers=['127.0.0.1:9092'],
            request_timeout_ms=1000,
            connections_max_idle_ms=1000
        )
        if producer.bootstrap_connected():
            status["kafka"] = "OK 🟢"
        producer.close()
    except Exception as e:
        status["kafka"] = f"FAIL 🔴: {str(e)}"
    
    #VERIFICAR ZOOKEPER
    try:
        # AF_INET fuerza el uso de IPv4 expresamente
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        # connect_ex devuelve 0 si la conexión es exitosa
        result = sock.connect_ex(('127.0.0.1', 2181))
        if result == 0:
            status["zookeeper"] = "OK 🟢"
        sock.close()
    except Exception:
        pass

    return jsonify(status)