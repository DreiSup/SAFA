This file (`consumer_crypto.py`) is no longer needed.
Its responsibilities were merged into `app/websockets.py`, which now reads directly from Kafka, saves to MongoDB, and emits via SocketIO in one step.
