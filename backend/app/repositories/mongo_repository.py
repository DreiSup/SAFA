import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI=os.getenv('MONGO_URI')
DB_NAME='safa_macro'

_client = None

def get_client():
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI)

    return _client


def insertar_uno(collection_name, documento):
    client = get_client()

    db = client[DB_NAME]
    collection = db[collection_name]
    collection.insert_one(documento)
