from app.repositories.vector_repository import crear_coleccion, upsert_noticias
from sentence_transformers import SentenceTransformer
import time
from app.repositories.mongo_repository import get_filtered, update_many
from app.utils.logger_setup import get_logger


logger = get_logger("encondding_worker")


MODEL = SentenceTransformer("all-MiniLM-L6-v2")
INTERVAL = 300


def run_encodder():
    crear_coleccion()

    mongo_docs = get_filtered(collection_name="sentiment_news", field="embedding_done", filter=False, limit=32)

    if not mongo_docs:                                                                                               
      logger.info("No documents to embed.")
      return
   
    try:
        dataToEmbed = []

        for doc in mongo_docs:
            dataToEmbed.append(doc["title"] + ";" + doc["description"])

        logger.info(f"data before embedding: {dataToEmbed}")

        embeddings = MODEL.encode(dataToEmbed)
        qdrant = upsert_noticias(mongo_docs, embeddings)

        if qdrant:
            ids = [doc["_id"] for doc in mongo_docs]

            mongo = update_many(collection_name="sentiment_news", filter_query={"_id": {"$in": ids}} , update_data={"$set": {"embedding_done": True}} )
            return mongo

    except Exception as e: 
        logger.error(f"Something went wrong: {str(e)}")

if __name__ == '__main__':
    try:
        while True:
            run_encodder()
            time.sleep(INTERVAL)
    except KeyboardInterrupt:
        logger.info("\n🛑 Deteniendo productor de noticias...")

        
    
