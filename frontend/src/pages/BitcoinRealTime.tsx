import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { financeService } from "@/services/financeService"
import type { Candle } from "@/services/financeService"

const ACCENT = "#f7931a"
const GRADIENT_ID = "colorBtc"

const formatPrice = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 })

const formatVolume = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`
  return v.toFixed(2)
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-950/95 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 text-zinc-400">{label}</p>
      <p className="font-semibold" style={{ color: ACCENT }}>{formatPrice(payload[0].value)}</p>
    </div>
  )
}

const BitcoinRealTime = () => {
  const [data, setData] = useState<{ time: string; price: number }[]>([])
  const [precioActual, setPrecioActual] = useState(0)
  const [precioInicial, setPrecioInicial] = useState(0)
  const [high30d, setHigh30d] = useState(0)
  const [low30d, setLow30d] = useState(0)
  const [volume, setVolume] = useState(0)
  const [isLive, setIsLive] = useState(false)

  const cambio = precioActual - precioInicial
  const cambioPct = precioInicial > 0 ? (cambio / precioInicial) * 100 : 0
  const esBajada = cambio < 0
  const colorDelta = esBajada ? "text-red-400" : "text-emerald-400"
  const bgDelta = esBajada
    ? "bg-red-500/10 border-red-500/30 text-red-400"
    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"

  useEffect(() => {
    const fetchDataInicial = async () => {
      try {
        const json = await financeService.getBitcoinCandles(720, "1h")
        if (json.status === "success" && json.data.length > 0) {
          const candles: Candle[] = json.data
          const chartData = candles.map(c => ({
            time: new Date(c.timestamp_open * 1000).toLocaleDateString("es-ES"),
            price: c.close,
          }))
          setData(chartData)
          setPrecioInicial(chartData[0].price)
          setPrecioActual(chartData[chartData.length - 1].price)
          setHigh30d(Math.max(...candles.map(c => c.high)))
          setLow30d(Math.min(...candles.map(c => c.low)))
          setVolume(candles[candles.length - 1].volume ?? 0)
        }
      } catch (err) {
        console.error("Error cargando velas BTC", err)
      }
    }
    fetchDataInicial()

    const socket = io("http://localhost:5000")
    socket.on("connect", () => setIsLive(true))
    socket.on("disconnect", () => setIsLive(false))
    socket.on("update_btc", (d) => {
      const hora = new Date(d.timestamp * 1000).toLocaleTimeString("es-ES")
      setPrecioActual(d.price)
      setData(prev => {
        const updated = [...prev, { time: hora, price: d.price }]
        if (updated.length > 800) updated.shift()
        return updated
      })
    })

    return () => { socket.disconnect() }
  }, [])

  const tickInterval = Math.max(1, Math.floor(data.length / 8))

  return (
    <Card className="w-full border-zinc-800 bg-zinc-950 text-white shadow-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-zinc-100">₿ Bitcoin</span>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                BTC/USDT
              </span>
              {isLive && (
                <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  LIVE
                </span>
              )}
            </div>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-4xl font-bold tracking-tight text-white">
                {formatPrice(precioActual)}
              </span>
              {precioInicial > 0 && (
                <span className={`mb-1 rounded-md border px-2 py-0.5 text-sm font-medium ${bgDelta}`}>
                  {esBajada ? "▼" : "▲"} {formatPrice(Math.abs(cambio))} ({Math.abs(cambioPct).toFixed(2)}%)
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="time"
                interval={tickInterval}
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                width={44}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={ACCENT}
                strokeWidth={2}
                fill={`url(#${GRADIENT_ID})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-4 divide-x divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/50">
          {[
            { label: "MÁX 30D", value: formatPrice(high30d), color: "text-emerald-400" },
            { label: "MÍN 30D", value: formatPrice(low30d), color: "text-red-400" },
            { label: "VOLUMEN (BTC)", value: formatVolume(volume), color: "text-zinc-100" },
            {
              label: "CAMBIO 30D",
              value: `${esBajada ? "" : "+"}${cambioPct.toFixed(2)}%`,
              color: colorDelta,
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center py-3">
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                {label}
              </span>
              <span className={`mt-1 text-sm font-semibold ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BitcoinRealTime
