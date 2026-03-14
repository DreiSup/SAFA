# SAFA — Backend (Flask + Python)

> Este archivo complementa el `CLAUDE.md` raíz. Contiene detalles específicos del backend.

---

## Responsabilidades del Backend

- Exponer la API REST que consume el frontend React
- Gestionar la lógica de finanzas personales (micro) con PostgreSQL
- Gestionar datos macro (noticias enriquecidas) con MongoDB
- Orquestar el pipeline de ingesta: NewsAPI → Kafka → Spark → FinBERT → MongoDB
- Servir datos en tiempo real via WebSockets

---

## Arquitectura Interna

```
app/
├── models/          — ORM / modelos de datos (PostgreSQL)
├── repositories/    — Acceso a datos (nunca lógica de negocio aquí)
│   └── mongo_repository.py   — CRUD para MongoDB
├── routes/          — Endpoints HTTP (solo routing, delegar a services)
│   ├── core/        — Endpoints básicos / health
│   ├── finance/     — Endpoints de finanzas personales
│   └── macro_routes/— Endpoints de datos macroeconómicos
├── schemas/         — Validación con Marshmallow + consumer Spark
│   ├── macro_schema.py       — Schema de noticias enriquecidas
│   └── consumer_spark.py     — Consumer PySpark + UDF Marshmallow + FinBERT
├── scripts/         — Scripts de inicialización / seed
│   ├── seed crypto/          — Poblar datos crypto iniciales
│   ├── seed sp500/           — Poblar datos SP500 iniciales
│   └── download_finbert/     — Descargar modelo FinBERT localmente
├── services/        — Lógica de negocio principal
│   ├── crypto/               — Integración y lógica de criptomonedas
│   ├── finbert/              — Wrapper del modelo FinBERT
│   ├── stocks/               — Integración y lógica de bolsa (SP500)
│   ├── producer_news.py      — Produce noticias de NewsAPI a Kafka
│   └── importer.py           — Importación de datos externos
├── utils/
│   └── logger_setup.py       — Logger centralizado (usar siempre este)
└── websockets.py             — WebSockets para datos en tiempo real
```

---

## Convenciones Obligatorias

### Estructura de capas (respetar estrictamente)
```
routes/ → services/ → repositories/ → DB
```
- Las **routes** solo hacen routing y delegan — sin lógica de negocio
- Los **services** contienen la lógica — sin acceso directo a DB
- Los **repositories** son la única capa que toca la DB
- Los **schemas** validan entrada/salida — siempre antes de escribir en DB

### Logging
```python
# ✅ Correcto
from app.utils.logger_setup import get_logger
logger = get_logger(__name__)
logger.info("Mensaje")

# ❌ Nunca
print("Mensaje")
```

### Validación con Marshmallow
```python
# Siempre validar antes de persistir
schema = NoticiaEnriquecidaSchema()
datos_validados = schema.load(datos_raw)  # Lanza ValidationError si falla
mongo_repository.insertar(datos_validados)
```

---

## Servicios Críticos — Precauciones

### `services/finbert/`
- El modelo corre en **CPU-only** — no usar `.cuda()` ni `.to(device)` sin confirmar
- La estructura del dict de salida está acoplada a `schemas/macro_schema.py` y a `schemas/consumer_spark.py`
- **No modificar el formato de salida** sin actualizar ambos schemas

### `services/producer_news.py`
- La deduplicación de noticias NewsAPI está implementada **en memoria (RAM)**
- Si el proceso se reinicia, puede volver a producir artículos ya procesados
- Pendiente: migrar anti-duplicados a Redis o a MongoDB

### `schemas/consumer_spark.py`
- Es el consumer PySpark Structured Streaming
- Consume del topic Kafka, aplica FinBERT via UDF, valida con Marshmallow
- **PRÓXIMO PASO**: al final del flujo, escribir en MongoDB (`noticias_enriquecidas`)

```python
# Así debe quedar el bloque final de consumer_spark.py
def escribir_en_mongo(batch_df, batch_id):
    registros = batch_df.toLocalIterator()
    for registro in registros:
        datos = registro.asDict()
        # Validar con Marshmallow
        schema = NoticiaEnriquecidaSchema()
        datos_validados = schema.load(datos)
        # Persistir
        mongo_repository.insertar_noticia_enriquecida(datos_validados)

query = df_enriquecido.writeStream \
    .foreachBatch(escribir_en_mongo) \
    .option("checkpointLocation", "/tmp/spark_checkpoints") \
    .start()
```

---

## Deuda Técnica del Backend

| Problema | Ubicación | Solución pendiente |
|---|---|---|
| Anti-duplicados en RAM | `producer_news.py` | Migrar a Redis o colección MongoDB `noticias_vistas` |
| Checkpoints Spark en `/tmp/` | `consumer_spark.py` | Mover a ruta persistente configurable |
| Retención Kafka manual | `docker-compose.yml` | Añadir `log.retention.hours` en config Kafka |

---

## Conexiones a Base de Datos

### PostgreSQL (datos micro — finanzas personales)
- Acceso via modelos ORM en `models/`
- Gestionar migraciones antes de cambiar schemas

### MongoDB (datos macro — noticias, sentimiento)
- Acceso **siempre** via `repositories/mongo_repository.py`
- Colección principal: `noticias_enriquecidas`
- No hacer queries directas a MongoDB fuera del repositorio

---

## Variables de Entorno Esperadas

```env
# Base de datos
POSTGRES_URL=postgresql://user:pass@localhost:5432/safa
MONGO_URI=mongodb://localhost:27017/safa

# APIs externas
NEWS_API_KEY=...

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
KAFKA_TOPIC_NOTICIAS=noticias_raw

# Flask
FLASK_ENV=development
FLASK_PORT=5000
```
