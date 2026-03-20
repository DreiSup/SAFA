import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pymongo.errors import BulkWriteError
from app.utils.logger_setup import get_logger 

load_dotenv()
logger = get_logger("Mongo_Repository")

MONGO_URI=os.getenv('MONGO_URI')
DB_NAME='safa_macro'

_client = None

def get_client():
    global _client
    if _client is None:
        _client = MongoClient(MONGO_URI)

    return _client


def insert_one(collection_name, document):
    client = get_client()

    db = client[DB_NAME]
    collection = db[collection_name]
    return collection.insert_one(document)


def insert_many(collection_name, documents):
    client = get_client()

    db = client[DB_NAME]
    collection = db[collection_name]

    try:
        collection.insert_many(documents, ordered=False)

    except BulkWriteError as e:
        logger.warning(f"Duplicates ignored when inserting in '{collection_name}' : {e.details['nInserted']} inserted")
