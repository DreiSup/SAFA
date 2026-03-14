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
                    └─> MongoDB — noticias_enriquecidas

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
5. **[PRÓXIMO PASO]** El resultado enriquecido se escribe en MongoDB (`noticias_enriquecidas`)
6. El frontend consulta MongoDB via Flask para mostrar sentimiento en tiempo real

---

## Estado Actual del Proyecto

### ✅ Completado
- Pipeline Kafka + Zookeeper funcional (Docker)
- PySpark Structured Streaming operativo
- FinBERT corriendo localmente y analizando sentimiento en tiempo real
- UDF de Marshmallow activa para validación de schemas
- Frontend micro casi terminado

### 🔄 En progreso (próximo paso inmediato)
- **Conectar MongoDB al final de `consumer_spark.py`** para persistir `noticias_enriquecidas`

### ⏳ Pendiente medio plazo
- Autocategorización de noticias por Embeddings
- Detección de anomalías en datos financieros

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
