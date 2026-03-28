import uuid
from datetime import datetime, timedelta
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, Range

client = QdrantClient(host="localhost", port=6333)
COLLECTION = "safa_news"
DIMS = 384
NAMESPACE = uuid.NAMESPACE_URL


def crear_coleccion():
    """Crea la colección si no existe"""
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION not in existing:
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=DIMS, distance=Distance.COSINE)
        )


def generar_id(titulo: str, fuente: str) -> str:
    """UUID5 determinístico — mismo artículo siempre produce el mismo ID."""
    return str(uuid.uuid5(NAMESPACE, f"{titulo}:{fuente}"))


def upsert_noticias(docs: list, embeddings: list):
    """Inserta o actualiza puntos en Qdrant con deduplicación por ID"""
    puntos = []
    for doc, vector in zip(docs, embeddings):
        puntos.append(PointStruct(
            id=generar_id(doc["title"], doc["source"]),
            vector=vector.tolist(),
            payload={
                "title": doc["title"],
                "source": doc["source"],
                "target": doc["target"],
                "sentiment": doc["sentiment"]["label"],
                "score_finbert": doc["sentiment"]["score"],
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
