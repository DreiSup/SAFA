import time                                                      
from sentence_transformers import SentenceTransformer
from app.repositories.mongo_repository import find, update_many  # ver nota abajo
from app.repositories.vector_repository import crear_coleccion, upsert_noticias  
from app.utils.logger_setup import get_logger 

client = QdrantClient(host="localhost", port=6333)
COLLECTION = "safa_news"
DIMS = 384

def crear_coleccion():
    """Crea la colección si no existe"""
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION not in existing:
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=DIMS, distance=Distance.COSINE)
        )

def generar_id():
    """MD5 como UUID - Qdrant requiere formato UUID, No hex raw."""
    raw = hashlib.md5(f"{titulo}{fuente}".encode()).hexdigest()
    return str(uuid.UUID(raw))

def upsert_noticias(docs: list, embeddings: list):
    """Inserta o actualiza puntos en Qdrant con deduplicación por ID"""
    puntos = []
    for doc, vector in zip(docs, embeddings):
        puntos.append(PointStruct(
            id=generar_id(doc["title"], doc["source"]),
            vector=vector.tolist(),
            payload={
                "title": doc["title"] ,
                "source": doc["source"],
                "sentiment": doc["sentiment"]["label"],
                "published_at": int(datetime.fromisoformat(doc["published_at"]).timestamp())
                                    if isinstance(doc["published_at"], str)
                                    else int(doc["published_at"].timestamp()),
                "mongo_id": str(doc["_id"])
            }
        ))
    client.upsert(collection_name=COLLECTION, points=puntos)

def buscar_noticias(query_vector: list, target: str, dias: int = 3, k: int = 8):
    """Búsqueda semántica con filtro temporal y por activo"""
    desde = int((datetime.now() - timedelta(days=dias)).timestamp())
    query_filter = Filter(must=[
        FieldCondition(key="published_at", range=Range(gte=desde)),
        FieldCondition(key="target", match={"value": target})
    ])
    return client.search(
        collection_name=COLLECTION,
        query_vector=query_vector,
        query_filter=query_filter,
        limit=k
    )