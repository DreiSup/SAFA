from app.repositories.vector_repository import crear_coleccion, upsert_noticias
from sentence_transformers import SentenceTransformer

from app.repositories.mongo_repository import get_filtered
from app.utils.logger_setup import get_logger


logger = get_logger("encondding_worker")


MODEL = SentenceTransformer("all-MiniLM-L6-v2")
INTERVAL = 300

sentences = [
    "The weather is crazy today.",
    "It's so sunny outside, i hate it!",
    "He drove to the stadium, that's lovely.",
]

docs = [                                                                                                         
      {"_id": "1", "title": "Bitcoin surges 10% amid institutional buying", "description": "Major hedge funds and asset managers have increased their Bitcoin holdings significantly this week.", "source": "Reuters", "target":   
  "bitcoin", "sentiment": {"label": "positive", "score": 0.95}, "published_at": "2026-03-28T10:00:00"},            
      {"_id": "2", "title": "S&P 500 drops on recession fears", "description": "Wall Street indices fell sharply as economic indicators pointed to a potential slowdown in growth.", "source": "Bloomberg", "target": "sp500",      
  "sentiment": {"label": "negative", "score": 0.88}, "published_at": "2026-03-28T11:00:00"},
      {"_id": "3", "title": "Federal Reserve holds interest rates steady", "description": "The Fed announced no changes to its benchmark rate, citing mixed signals from the labor market.", "source": "CNBC", "target": "sp500",
   "sentiment": {"label": "neutral", "score": 0.76}, "published_at": "2026-03-28T12:00:00"},
      {"_id": "4", "title": "Crypto market rallies after ETF approval", "description": "The SEC green-lit three new spot crypto ETFs, triggering a broad rally across digital assets.", "source": "CoinDesk", "target": "bitcoin",  
  "sentiment": {"label": "positive", "score": 0.91}, "published_at": "2026-03-28T13:00:00"},
      {"_id": "5", "title": "Tech stocks lead market selloff", "description": "Nasdaq fell over 2% as investors rotated out of high-growth technology companies.", "source": "WSJ", "target": "sp500", "sentiment": {"label":    
  "negative", "score": 0.83}, "published_at": "2026-03-28T14:00:00"},
  ]   

forEmbedding = []

for doc in docs:
    forEmbedding.append(doc["title"] + "; " + doc["description"] )
    print(forEmbedding)

embeddings = MODEL.encode(forEmbedding)
print(embeddings)
print(embeddings.shape)

similarities = MODEL.similarity(embeddings, embeddings)
print(similarities)


def data_mongo():

    data = get_filtered(collection_name="sentiment_news", field="embedding_done", filter=False )
    print(data)

data_mongo()

def run_encodder():

    crear_coleccion()


    try:
        upsert_noticias(docs, embeddings)
    except Exception as e: 
        logger.error(f"Something went wrong: {str(e)}")

    
