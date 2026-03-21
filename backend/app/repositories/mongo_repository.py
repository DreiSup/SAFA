import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pymongo.errors import BulkWriteError, DuplicateKeyError
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

    try:
        return collection.insert_one(document)
    
    except DuplicateKeyError as e:
        logger.warning(f"Duplicate ignored when inserting in '{collection_name}'")


def insert_many(collection_name, documents):
    client = get_client()

    db = client[DB_NAME]
    collection = db[collection_name]

    try:
        collection.insert_many(documents, ordered=False)

    except BulkWriteError as e:
        logger.warning(f"Duplicates ignored when inserting in '{collection_name}' : {e.details['nInserted']} inserted")


def get_sentiment_summary(collection_name, since_hours=24):
    from datetime import datetime, timedelta, timezone

    client = get_client()
    db = client[DB_NAME]
    collection = db[collection_name]

    since = datetime.now(timezone.utc) - timedelta(hours=since_hours)
    docs = list(collection.find({"published_at": {"$gte": since}}))

    direction_map = {"positive": 1, "negative": -1, "neutral": 0}
    groups = {}

    for doc in docs:
        target = doc.get("target", "general_macro")
        sentiment = doc.get("sentiment", {})
        label = sentiment.get("label", "neutral") if isinstance(sentiment, dict) else "neutral"
        score = sentiment.get("score", 0.5) if isinstance(sentiment, dict) else 0.5
        impact = doc.get("impact_score", 0.5)
        direction = direction_map.get(label, 0)

        if target not in groups:
            groups[target] = {"weighted_sum": 0.0, "impact_sum": 0.0, "n": 0}

        groups[target]["weighted_sum"] += impact * score * direction
        groups[target]["impact_sum"] += impact
        groups[target]["n"] += 1

    result = {}
    for target, g in groups.items():
        ws = g["weighted_sum"] / g["impact_sum"] if g["impact_sum"] > 0 else 0.0
        if ws > 0.1:
            label = "positive"
        elif ws < -0.1:
            label = "negative"
        else:
            label = "neutral"
        result[target] = {"score": round(ws, 4), "label": label, "n": g["n"]}

    return result
