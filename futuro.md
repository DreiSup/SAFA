# PRÓXIMO PASO — BASE VECTORIAL QDRANT PARA RAG EN SAFA

## Objetivo

Dado un movimiento de precio significativo (ej. "S&P500 cayó 2% hoy"), recuperar las noticias más semánticamente relevantes de los últimos días y pasárselas a un LLM como contexto para generar un informe de texto que luego se convertirá a audio (TTS).

---

## Decisión de stack (ya tomada)

- **Base vectorial:** Qdrant local en Docker (puerto 6333). NO Atlas Vector Search (requiere M10+ ~57$/mes). NO ChromaDB.
- **Modelo de embeddings:** `sentence-transformers/all-MiniLM-L6-v2` (384 dims, ~80MB, CPU).
  - Este modelo es SOLO para embeddings.
  - FinBERT sigue siendo SOLO para clasificación de sentimiento (positivo/negativo/neutral).
  - Son propósitos distintos, NO intercambiables.
- **LLM para generación:** Claude API (Anthropic).
- **pgvector en PostgreSQL:** feature SEPARADA e independiente para autocategorización de transacciones personales. No tiene relación con el pipeline RAG de noticias.

---

## Arquitectura completa

### Lo que YA EXISTE — NO TOCAR

```
NewsAPI / Reddit
  └─> producer_news.py / producer_reddit.py
        └─> Kafka (topics: news_ticker / reddit_ticker)
              └─> consumer_spark.py
                    ├─> FinBERT → sentiment (NO modificar esta lógica)
                    └─> MongoDB (colecciones: sentiment_news / sentiment_reddit)
```

### Lo que HAY QUE AÑADIR

```
embedding_worker.py [NUEVO SERVICIO]
  └─> Lee MongoDB sin embedding → genera embedding → escribe en Qdrant

app/repositories/vector_repository.py [✅ IMPLEMENTADO — revisar pendientes abajo]
  └─> CRUD Qdrant: crear colección, upsert (con dedup UUID5), search (con filtro temporal)

app/services/report_generator.py [NUEVO]
  ├─ MongoDB prices → detecta movimiento significativo del día
  ├─ Construye query semántica dinámica
  ├─ Qdrant vector search → top-k noticias relevantes
  ├─ Combina: precio + noticias + sentimiento agregado
  └─> Claude API → texto del informe

GET /api/v1/macro/report [NUEVO ENDPOINT en macro_routes.py]
```

---

## Archivos a modificar / crear

| Archivo | Cambio |
|---|---|
| `docker-compose.yml` | ✅ Qdrant añadido en puerto 6333 con volumen persistente |
| `app/repositories/vector_repository.py` | ✅ CRUD Qdrant implementado (pendiente: corregir generar_id a UUID5 + añadir imports) |
| `app/schemas/consumer_spark.py` | ⏳ Añadir `_id` UUID5 + flag `embedding_done: False` antes de insert_many |
| `app/services/embedding_worker.py` | ⏳ Servicio independiente de embeddings |
| `app/services/report_generator.py` | ⏳ Lógica RAG completa |
| `app/routes/macro_routes.py` | ⏳ Añadir endpoint `/api/v1/macro/report` |
| `requirements.txt` | ⏳ Añadir `qdrant-client`, `sentence-transformers`, `anthropic` |

---

## Detalles de implementación críticos

### 1. `embedding_worker.py`

- Responsabilidad ÚNICA: leer MongoDB sin embedding → generar embedding → escribir en Qdrant
- NO integrar dentro de `consumer_spark.py`. Son servicios separados.
- Procesar en batch controlado — NUNCA noticia por noticia en un bucle for:

```python
def encode_en_batches(modelo, textos, batch_size=32):
    todos_embeddings = []
    for i in range(0, len(textos), batch_size):
        lote = textos[i:i + batch_size]
        embeddings = modelo.encode(lote, batch_size=batch_size, convert_to_numpy=True)
        todos_embeddings.extend(embeddings)
    return todos_embeddings
```

### 2. `vector_repository.py`

- Colección: `"safa_news"`
- Payload: `title, source, target, sentiment, score_finbert, published_at`
- Métrica de similitud: cosine

**Deduplicación OBLIGATORIA** — usar UUID5 como ID del punto en Qdrant (y como `_id` en MongoDB).
UUID5 es determinístico, formato UUID nativo, y más robusto que MD5:

```python
import uuid
NAMESPACE = uuid.NAMESPACE_URL
def generar_id(titulo: str, fuente: str) -> str:
    return str(uuid.uuid5(NAMESPACE, f"{titulo}:{fuente}"))
```

**Filtro temporal OBLIGATORIO** en todas las búsquedas.
Sin filtro, devuelve noticias de hace meses que son semánticamente relevantes pero temporalmente irrelevantes:

```python
from qdrant_client.models import Filter, FieldCondition, Range
query_filter = Filter(
    must=[
        FieldCondition(
            key="published_at",
            range=Range(gte=int((datetime.now() - timedelta(days=3)).timestamp()))
        ),
        FieldCondition(key="target", match={"value": activo})
    ]
)
```

### 3. `report_generator.py`

**Umbrales en config, NO hardcodeados:**

```python
UMBRAL_MOVIMIENTO = {
    "SP500": 0.8,   # 0.8% ya es notable en SP500
    "BTC": 3.0      # Bitcoin necesita más para ser señal
}
```

**Query semántica DINÁMICA** basada en el movimiento real detectado — NO queries estáticas:

```python
def construir_query_semantica(activo, variacion_pct):
    direccion = "decline" if variacion_pct < 0 else "rally"
    magnitud = "sharp" if abs(variacion_pct) > 2 else "moderate"
    return f"{activo} {magnitud} {direccion} {abs(variacion_pct):.1f}% market drivers"
```

**Validación con Marshmallow** antes de upsert en Qdrant y antes de devolver respuesta al cliente.

---

## Feature separada: pgvector para autocategorización de gastos

Implementar de forma completamente independiente al pipeline RAG.

**Objetivo:** al importar una transacción desde CSV, categorizarla automáticamente comparando su embedding con embeddings de referencia de cada categoría.

**Paso crítico:** se necesitan embeddings de referencia para cada categoría. Sin ellos no hay nada contra qué comparar:

```python
categorias_referencia = {
    "alimentación": "supermercado comida compra alimentación mercado",
    "transporte": "gasolina metro bus taxi uber transporte",
    "ocio": "restaurante bar cine concierto entretenimiento",
    "salud": "farmacia médico hospital seguro médico"
}
```

Archivos:
- `app/models/transaction.py`: añadir columna `embedding vector(384)`
- `app/services/importer.py`: al importar CSV, generar embedding del `concepto` y asignar `categoria_ia`

---

## Secuencia de implementación (respetar este orden)

1. Qdrant en Docker → verificar UI en `localhost:6333/dashboard`
2. `vector_repository.py` → crear colección, upsert con deduplicación, search con filtro temporal
3. `embedding_worker.py` → batch processing controlado + escritura en Qdrant
4. Probar end-to-end → publicar noticia → MongoDB + Qdrant
5. `report_generator.py` → query dinámica + RAG + Claude API
6. Endpoint en `macro_routes.py` → con validación Marshmallow
7. pgvector (feature independiente, puede hacerse en paralelo o después)

---

## Criterios de verificación

1. `docker-compose up -d` → Qdrant UI en `http://localhost:6333/dashboard`
2. Publicar artículo de prueba via `producer_news` → verificar entrada en Qdrant con embedding correcto y sin duplicados
3. Llamar `GET /api/v1/macro/report` → recibir texto con noticias semánticamente relevantes al movimiento de precio del día
4. Comparar resultados de búsqueda vectorial vs búsqueda por keyword para validar que el RAG aporta valor real

---

## Lo que NO hacer

- No mover la lógica de embeddings dentro de `consumer_spark.py`
- No procesar embeddings noticia por noticia en un bucle for
- No hacer upsert en Qdrant sin hash de deduplicación
- No hacer búsquedas en Qdrant sin filtro temporal
- No hardcodear umbrales de movimiento de precio
- No usar queries semánticas estáticas en `report_generator.py`
- No mezclar la feature de pgvector con el pipeline RAG de Qdrant
- No usar FinBERT para generar embeddings (es clasificador, no modelo de embeddings)
- No añadir LangChain — Claude API directa es suficiente para este caso de uso
