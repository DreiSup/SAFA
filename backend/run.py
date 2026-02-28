from app import create_app
from app.extensions import socketio

app = create_app()

if __name__ == '__main__':
    print("🌐 Iniciando servidor Flask con soporte WebSocket (Eventlet)...")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)