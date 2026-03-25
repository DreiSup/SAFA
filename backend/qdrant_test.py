from qdrant_client import QdrantClient

client = QdrantClient(host="localhost", port=6333)

from qdrant_client.models import VectorParams, Distance

if not client.collection_exists("my_collection"):
   client.create_collection(
      collection_name="my_collection",
      vectors_config=VectorParams(size=100, distance=Distance.COSINE),
   )

   
import numpy as np
from qdrant_client.models import PointStruct

vectors = np.random.rand(100, 100)
client.upsert(
   collection_name="my_collection",
   points=[
      PointStruct(
            id=idx,
            vector=vector.tolist(),
            payload={"color": "red", "rand_number": idx % 10}
      )
      for idx, vector in enumerate(vectors)
   ]
)

query_vector = np.random.rand(100)
hits = client.search(
   collection_name="my_collection",
   query_vector=query_vector,
   limit=5  # Return 5 closest points
)