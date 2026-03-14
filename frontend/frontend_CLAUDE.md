# SAFA — Frontend (React + ShadcnUI)

> Este archivo complementa el `CLAUDE.md` raíz. Contiene detalles específicos del frontend.

---

## Responsabilidades del Frontend

- Mostrar el estado financiero personal del usuario (micro)
- Visualizar datos de mercado en tiempo real (cripto + bolsa)
- Conectarse al backend via REST y WebSockets
- Presentar el sentimiento del mercado generado por FinBERT

---

## Estructura

```
src/
├── pages/
│   ├── Home/            — Dashboard principal del usuario
│   ├── Chart/           — Gráficos históricos de activos
│   ├── BitcoinRealTime/ — Precio y sentimiento BTC en tiempo real
│   ├── SP500RealTime/   — Precio y sentimiento SP500 en tiempo real
│   └── NotFound/        — Página 404
└── services/
    ├── axiosClient.js   — Instancia Axios configurada (usar siempre esta)
    └── financeService.js— Métodos para llamar a la API de finanzas
```

---

## Convenciones Obligatorias

### HTTP — siempre via `axiosClient`
```javascript
// ✅ Correcto
import axiosClient from '../services/axiosClient';
const data = await axiosClient.get('/api/macro/sentimiento');

// ❌ Nunca fetch directo
const data = await fetch('http://localhost:5000/api/macro/sentimiento');
```

### Componentes UI — siempre ShadcnUI
- Usar componentes de ShadcnUI antes de crear componentes custom
- Si un componente no existe en ShadcnUI, construirlo encima de primitivos Radix
- No mezclar librerías de UI (no MUI, no Ant Design)

### WebSockets — datos en tiempo real
Las páginas `BitcoinRealTime` y `SP500RealTime` se conectan via WebSocket al backend:
```javascript
// Patrón estándar para WebSocket en estas páginas
useEffect(() => {
  const ws = new WebSocket('ws://localhost:5000/ws/mercado');
  ws.onmessage = (event) => {
    const dato = JSON.parse(event.data);
    setDatos(dato);
  };
  return () => ws.close(); // cleanup obligatorio
}, []);
```

---

## Páginas — Detalle

### `Home/`
- Dashboard principal
- Muestra resumen del patrimonio del usuario (datos desde PostgreSQL via API)
- Punto de entrada a las demás secciones

### `Chart/`
- Gráficos históricos de activos (cripto y bolsa)
- Usa los datos de `financeService.js`

### `BitcoinRealTime/` y `SP500RealTime/`
- Datos en tiempo real via WebSocket
- Muestran precio actual + sentimiento FinBERT de las últimas noticias
- Son las páginas más críticas en rendimiento — evitar re-renders innecesarios

---

## Integración con el Backend

### Base URL
Configurada en `axiosClient.js`. No hardcodear URLs en los componentes.

### Endpoints principales esperados
| Endpoint | Descripción |
|---|---|
| `GET /api/macro/sentimiento` | Últimas noticias con score FinBERT |
| `GET /api/finance/patrimonio` | Estado financiero personal del usuario |
| `GET /api/finance/crypto` | Datos de criptomonedas |
| `GET /api/finance/stocks` | Datos de bolsa |
| `WS  /ws/mercado` | Stream en tiempo real de precios y sentimiento |

---

## Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

---

## Reglas de Rendimiento

- Las páginas RealTime deben usar `useMemo` / `useCallback` para evitar re-renders en cada tick del WebSocket
- No hacer llamadas HTTP dentro de loops o en cada render
- Datos históricos: paginados o con límite — no traer colecciones completas
