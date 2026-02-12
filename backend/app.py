import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from pymongo import MongoClient
from kafka import KafkaProducer
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# CONFIG POSTGRES
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# MONGO
mongo_client = MongoClient(os.getenv('MONGO_URI'))
mongo_db = mongo_client['safa_data']


# RUTA DE DIAGNÓSTICO
@app.route('/health')
def health_check():
    status = {
        "app": "SAFA Backend",
        "postgress": "Unknown",
        "mongo": "Unknown",
        "kafka": "Unknown",
    }

    # probar postgres
    try: 
        db.session.execute(db.text('SELECT 1'))
        status["postgres"] = "OK 🟢"
    except Exception as e: 
        status["postgres"] = f"FAIL 🔴: {str(e)}"
    
    # probar mongo
    try: 
        mongo_client.server_info()
        status["mongo"] = "OK 🟢"
    except Exception as e: 
        status["mongo"] = f"FAIL 🔴: {str(e)}"
    
    # probar kafka
    try: 
        producer = KafkaProducer(bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS'))
        status["kafka"] = "OK 🟢"
    except Exception as e: 
        status["kafka"] = f"FAIL 🔴: {str(e)}"

    return jsonify(status)

@app.route('/')
def home():
    return jsonify({"status": "Safa Backend Running", "mode": "Flask"})


if __name__ == '__main__':
    app.run(debug=True, port=5000)