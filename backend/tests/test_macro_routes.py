import requests

BASE_URL = "http://localhost:5000"

CANDLE_FIELDS = {"asset", "symbol", "interval", "open", "high", "low", "close", "volume", "timestamp_open"}
TICK_FIELDS = {"asset_class", "symbol", "price", "timestamp"}


# --- BTC candles ---

def test_btc_candles_returns_200():
    r = requests.get(f"{BASE_URL}/api/v1/macro/btc/candles")
    assert r.status_code == 200

def test_btc_candles_response_structure():
    r = requests.get(f"{BASE_URL}/api/v1/macro/btc/candles")
    body = r.json()
    assert body["status"] == "success"
    assert isinstance(body["data"], list)

def test_btc_candles_fields():
    r = requests.get(f"{BASE_URL}/api/v1/macro/btc/candles?limit=1")
    print(r.json)
    candle = r.json()["data"][0]
    assert CANDLE_FIELDS.issubset(candle.keys())

def test_btc_candles_limit():
    r = requests.get(f"{BASE_URL}/api/v1/macro/btc/candles?limit=10")
    assert len(r.json()["data"]) == 10

def test_btc_candles_limit_365():
    r = requests.get(f"{BASE_URL}/api/v1/macro/btc/candles?limit=365")
    assert len(r.json()["data"]) == 365

def test_btc_candles_interval_1d():
    r = requests.get(f"{BASE_URL}/api/v1/macro/btc/candles?interval=1d&limit=5")
    data = r.json()["data"]
    assert all(c["interval"] == "1d" for c in data)


# --- SP500 candles ---

def test_sp500_candles_returns_200():
    r = requests.get(f"{BASE_URL}/api/v1/macro/sp500/candles")
    assert r.status_code == 200

def test_sp500_candles_response_structure():
    r = requests.get(f"{BASE_URL}/api/v1/macro/sp500/candles")
    body = r.json()
    assert body["status"] == "success"
    assert isinstance(body["data"], list)

def test_sp500_candles_fields():
    r = requests.get(f"{BASE_URL}/api/v1/macro/sp500/candles?limit=1")
    candle = r.json()["data"][0]
    assert CANDLE_FIELDS.issubset(candle.keys())

def test_sp500_candles_limit():
    r = requests.get(f"{BASE_URL}/api/v1/macro/sp500/candles?limit=10")
    assert len(r.json()["data"]) == 10

def test_sp500_candles_limit_365():
    r = requests.get(f"{BASE_URL}/api/v1/macro/sp500/candles?limit=365")
    assert len(r.json()["data"]) == 365


# --- BTC ticks ---

def test_btc_ticks_returns_200():
    r = requests.get(f"{BASE_URL}/api/v1/macro/btc/ticks")
    assert r.status_code == 200

def test_btc_ticks_response_structure():
    r = requests.get(f"{BASE_URL}/api/v1/macro/btc/ticks")
    body = r.json()
    assert body["status"] == "success"
    assert isinstance(body["data"], list)


# --- SP500 ticks ---

def test_sp500_ticks_returns_200():
    r = requests.get(f"{BASE_URL}/api/v1/macro/sp500/ticks")
    assert r.status_code == 200

def test_sp500_ticks_response_structure():
    r = requests.get(f"{BASE_URL}/api/v1/macro/sp500/ticks")
    body = r.json()
    assert body["status"] == "success"
    assert isinstance(body["data"], list)
