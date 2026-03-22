# SAFA — Plataforma de Inteligencia Financiera

## Descripción
SAFA une finanzas personales (micro) con macroeconomía global. Su producto principal es un reporte de audio diario de ~2 minutos que cruza el estado del patrimonio del usuario con el sentimiento del mercado cripto/bursátil en tiempo real.

---

## Arquitectura General

```
NewsAPI
  └─> producer_news.py (Flask)
        └─> Kafka (Docker)
              └─> consumer_spark.py (PySpark Structured Streaming)
                    ├─> FinBERT (HuggingFace) — análisis de sentimiento
                    └─> MongoDB — sentiment_news

PostgreSQL — datos financieros personales del usuario (micro)
MongoDB    — noticias y datos macro del mercado

React Frontend <──> Flask API <──> PostgreSQL + MongoDB
                              └──> WebSockets (tiempo real)
```

---

## Stack Completo

| Capa | Tecnología |
|---|---|
| Frontend | React + ShadcnUI |
| Backend | Flask + Python |
| Streaming | Kafka + Zookeeper (Docker), Spark PySpark Structured Streaming |
| Base de datos micro | PostgreSQL |
| Base de datos macro | MongoDB |
| NLP / Sentimiento | FinBERT (HuggingFace), PyTorch CPU-only |
| Validación | Marshmallow |
| Fuente de noticias | NewsAPI |
| Ingesta de datos | Scripts seed crypto/SP500 |

---

## Estructura del Proyecto

```
safa/
├── backend/
│   └── app/
│       ├── models/
│       ├── repositories/
│       │   └── mongo_repository.py
│       ├── routes/
│       │   ├── core/
│       │   ├── finance/
│       │   └── macro_routes/
│       ├── schemas/
│       │   ├── macro_schema.py
│       │   └── consumer_spark.py
│       ├── scripts/
│       │   ├── seed crypto/
│       │   ├── seed sp500/
│       │   └── download_finbert/
│       ├── services/
│       │   ├── crypto/
│       │   ├── finbert/
│       │   ├── stocks/
│       │   ├── producer_news.py
│       │   └── importer.py
│       ├── utils/
│       │   └── logger_setup.py
│       └── websockets.py
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home
        │   ├── Chart
        │   ├── Bitcoin RealTime
        │   ├── SP500 RealTime
        │   └── NotFound
        └── services/
            ├── axiosClient
            └── financeService
```

---

## Flujo de Datos Principal

1. `producer_news.py` consulta NewsAPI y publica artículos en Kafka
2. `consumer_spark.py` consume el topic de Kafka con PySpark Structured Streaming
3. Cada artículo pasa por FinBERT → genera score de sentimiento (positive/negative/neutral)
4. La UDF de Marshmallow valida el schema del resultado
5. El resultado enriquecido se escribe en MongoDB (`sentiment_news`)
6. El frontend consulta MongoDB via Flask para mostrar sentimiento en tiempo real

---

## Estado Actual del Proyecto

### ✅ Completado
- Pipeline Kafka + Zookeeper funcional (Docker)
- PySpark Structured Streaming operativo
- FinBERT corriendo localmente y analizando sentimiento en tiempo real
- UDF de Marshmallow activa para validación de schemas
- Pipeline completo: noticias enriquecidas con FinBERT persistidas en MongoDB (`sentiment_news`)
- Frontend micro casi terminado
- Gráficas BTC y SP500 visibles en frontend (WebSockets conectados)
- `producer_reddit.py` creado: fetchea posts de Reddit (wallstreetbets, Bitcoin, CryptoCurrency, investing), clasifica por target y publica en Kafka

### 🔜 Próximo paso inmediato — separar flujos News y Reddit
Actualmente Reddit publica en el mismo topic `news_ticker` y colección `sentiment_news` que NewsAPI.
Hay que separarlos para poder compararlos. El plan está diseñado: solo 2 archivos, mínimos cambios.

1. `backend/app/services/producer_reddit.py` línea 11 → `TOPIC = "reddit_ticker"`
2. `backend/app/schemas/consumer_spark.py`:
   - `.option("subscribe", "news_ticker,reddit_ticker")` — Spark añade columna `topic` automáticamente
   - `flujo_limpio.select("json_validado", "topic")` — pasar columna al batch
   - En `procesar_batch`: separar docs por `line["topic"]` → `insert_many("sentiment_news", ...)` o `insert_many("sentiment_reddit", ...)`

### ⏳ Pendiente medio plazo
- Autocategorización de noticias por Embeddings
- Detección de anomalías en datos financieros
- Anti-duplicados persistentes en DB (ahora son solo en RAM, se pierden al reiniciar)
- **Charts BTC y SP500 no funcionan como deben**: solo hay datos de hace ~2 semanas en DB, necesitan ingesta continua casi en tiempo real. Las gráficas se ven pero no reflejan el estado actual del mercado.

### 🚀 Largo plazo
- Pipeline RAG + LLM + TTS para generación del reporte de audio diario

---

## Deuda Técnica Conocida

| Problema | Impacto | Prioridad |
|---|---|---|
| Anti-duplicados de NewsAPI en RAM | Se pierden al reiniciar el servicio | Media |
| Checkpoints de Spark en `/tmp/` | No son persistentes entre reinicios | Media |
| Retención de Kafka gestionada manualmente | Sin política automática de limpieza | Baja |

---

## Comandos Clave

```bash
# Infraestructura
docker-compose up -d          # Levanta Kafka + Zookeeper
docker-compose down           # Para la infraestructura

# Backend
cd backend && python app.py   # Inicia el servidor Flask
python -m app.services.producer_news    # Lanza el productor de noticias
python -m app.schemas.consumer_spark    # Lanza el consumer de Spark + FinBERT

# Frontend
cd frontend && npm run dev    # Inicia el frontend React en desarrollo
```

---

## Reglas Generales del Proyecto

- **No asumir GPU**: PyTorch corre en CPU-only, no usar `.cuda()` ni device detection sin avisar
- **Logs siempre via `utils/logger_setup.py`**, nunca `print()`
- **Validación con Marshmallow** antes de cualquier escritura en base de datos
- **No modificar el schema de salida de FinBERT** sin revisar `consumer_spark.py` — están acoplados
- **El frontend consume la API via `axiosClient`**, no fetch directo
