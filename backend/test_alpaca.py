"""
Script de prueba: verifica que el WebSocket de Alpaca recibe trades en tiempo real.
Usa el stream de crypto (BTC/USD) porque funciona 24/7, sin depender del horario de bolsa.
Eliminar tras verificar.
"""
import json
import os
import websocket
from dotenv import load_dotenv

load_dotenv()

ALPACA_API_KEY = os.getenv("ALPACA_API_KEY")
ALPACA_SECRET_KEY = os.getenv("ALPACA_SECRET_KEY")
WS_URL = "wss://stream.data.alpaca.markets/v1beta3/crypto//eu-1"

def on_open(ws):
    print("Conectado")

def on_message(ws, message):
    data = json.loads(message)
    for msg in data:
        if msg.get("T") == "success" and msg.get("msg") == "connected":
            print("connected — enviando auth...")
            ws.send(json.dumps({"action": "auth", "key": ALPACA_API_KEY, "secret": ALPACA_SECRET_KEY}))
        elif msg.get("T") == "success" and msg.get("msg") == "authenticated":
            print("authenticated — suscribiendo a BTC/USD...")
            ws.send(json.dumps({"action": "subscribe", "trades": ["BTC/USD"]}))
        elif msg.get("T") == "t":
            print(f"TRADE recibido → symbol: {msg['S']}  precio: {msg['p']}  timestamp: {msg['t']}")
        else:
            print(f"otro mensaje: {msg}")

def on_error(ws, error):
    print(f"ERROR: {error}")

def on_close(ws, code, msg):
    print(f"Cerrado: {code} - {msg}")

if __name__ == "__main__":
    ws = websocket.WebSocketApp(WS_URL, on_open=on_open, on_message=on_message, on_error=on_error, on_close=on_close)
    ws.run_forever()
