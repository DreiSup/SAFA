import { useState, useEffect, useRef, useMemo } from 'react'
import { io } from 'socket.io-client'
import type { CandleListResponse } from '@/services/financeService'
import type { OHLCVData } from '@/types/markets'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AssetChartProps {
  name: string,
  ticker: string,
  accent: string,
  socketEvent: string,
  fetchCandles: (limit: number, interval: string) => Promise<CandleListResponse>,
  volumeLabel?: string
  onDataLoad?: (data: OHLCVData) => void
}

interface ChartPoint {
  time: string,
  price: number,
  timestamp: number
}

type ViewMode = 'gradient' | 'linear'

const PERIODS = {
  "1D": {interval: "1m", limit: 1440, timerMs: 60000},
  "1W": {interval: "1h", limit: 168, timerMs: 3600000},
  "1M": {interval: "1h", limit: 720, timerMs: 3600000},
  "1Y": {interval: "1d", limit: 365, timerMs: 86400000}
}

const AssetChart = ({name, ticker, accent, socketEvent, fetchCandles, volumeLabel, onDataLoad} : AssetChartProps) => {

  const [data, setData] = useState<ChartPoint[]>([])
  const [actualPrice, setActualPrice] = useState(0)
  const [initialPrice, setInitialPrice] = useState(0)
  const [high, setHigh] = useState(0)
  const [low, setLow] = useState(0)
  const [volume, setVolume] = useState(0)
  const [isLive, setIsLive] = useState(false)
  const [activePeriod, setActivePeriod] = useState<keyof typeof PERIODS>('1D')
  const [viewMode, setViewMode] = useState<ViewMode>('gradient')
  const [isAnimating, setIsAnimating] = useState(false)

  const change = actualPrice - initialPrice
  const changePct = initialPrice > 0 ? (change / initialPrice) * 100 : 0
  const isDescend = change < 0

  const lastTimestamp = useRef(0)

  //fetch data candles
  useEffect(() => {
    const loadData = async () => {
      try{
          const {interval, limit} = PERIODS[activePeriod]
          const json = await fetchCandles(limit, interval)
          if (json.status === 'success' && json.data.length > 0) {
            const candles = json.data

            console.log("CANDLES:", candles)

            const chartData = candles.map((candle, index) => {
              console.log(candle.timestamp_open, new Date(candle.timestamp_open * 1000))
              
              const d = new Date(candle.timestamp_open * 1000)

              let time: string
              if (interval === "1m") {
                time = d.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}) 
              } else if (interval === "1h"){
                const prev = candles[index - 1]
                const sameDay = prev
                  && new Date(prev.timestamp_open * 1000).toLocaleDateString('es-ES')
                    === d.toLocaleDateString('es-ES')
                  time = sameDay
                    ? d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                    : d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) 
              } else {
                time = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
              }

              return { time, price: candle.close, timestamp: candle.timestamp_open * 1000 }
            })
            console.log(chartData)
            setIsAnimating(true)
            setData(chartData)
            setInitialPrice(chartData[0].price)
            setActualPrice(chartData[chartData.length - 1].price)
            // .map devuelve [], pero Math.max necesita argumentos separados por comas, por tanto se usa ... para spread
            setHigh(Math.max(...candles.map(c => c.high)))
            setLow(Math.min(...candles.map(c => c.low)))
            setVolume(candles[candles.length - 1].volume ?? 0)
            lastTimestamp.current = candles[candles.length - 1].timestamp_open
            onDataLoad?.({
              open:   candles[0].open,                                                     
              high:   Math.max(...candles.map(c => c.high)),                               
              low:    Math.min(...candles.map(c => c.low)),                                
              close:  candles[candles.length - 1].close,          
              volume: candles[candles.length - 1].volume ?? 0, 
            })
            setTimeout(() => setIsAnimating(false), 1500)
          }
      }
      catch (err) {
        console.log("Error cargando velas", err)
      }
    }
    loadData()
  }, [activePeriod, fetchCandles, onDataLoad])

  //websocket
  useEffect(() => {
    const socket = io("http://localhost:5000")
    
    socket.on("connect", () => setIsLive(true))
    socket.on("disconnect", () => setIsLive(false))
    socket.on(socketEvent, (d) => setActualPrice(d.price))
    console.log(actualPrice)
    return () => {
      socket.disconnect()
    }
  }, [])

  //auto-avance, fetchea última candle
  useEffect(() => {                                                                                                
    const { interval, timerMs } = PERIODS[activePeriod]
                                                                                                                   
    let intervalId: ReturnType<typeof setInterval>                                                                 
                                                                                                                   
    const fetchLatest = async () => {                                                                              
      const latest = await fetchCandles(1, interval)
      if (latest.status !== 'success' || latest.data.length === 0) return                                          
   
      const newCandle = latest.data[0]                                                                             
      if (newCandle.timestamp_open === lastTimestamp.current) return

      const prevTimestamp = lastTimestamp.current                                                                  
      lastTimestamp.current = newCandle.timestamp_open
                                                                                                                   
      const d = new Date(newCandle.timestamp_open * 1000)
      let time: string
      if (interval === "1m") {
        time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      } else if (interval === "1h") {                                                                              
        const sameDay = new Date(prevTimestamp * 1000).toLocaleDateString('es-ES')
                     === d.toLocaleDateString('es-ES')                                                             
        time = sameDay
          ? d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })                                  
          : d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      } else {                                                                                                     
        time = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      }                                                                                                            
                  
      setData(prev => [...prev.slice(1), { time, price: newCandle.close, timestamp: newCandle.timestamp_open * 1000 }])                                        
    }
                                                                                                                   
    const msUntilBoundary = timerMs - (Date.now() % timerMs) + 2000
    const timeoutId = setTimeout(async () => {
      await fetchLatest()
      intervalId = setInterval(fetchLatest, timerMs)                                                               
    }, msUntilBoundary)
                                                                                                                   
    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [activePeriod, fetchCandles])

  const formatYTick = (v: number) => {
    if (v >= 1000) {
      const k = v / 1000
      return `${Number.isInteger(k) ? k : k.toFixed(1)}k`
    }
    return v >= 10 ? Math.round(v).toString() : v.toFixed(1)
  }

  const xTicks = useMemo(() => {
    if (data.length === 0) return []

    if (activePeriod === '1D') {
      return data
        .filter(p => p.timestamp % 3600000 === 0)
        .map(p => p.time)
    }

    if (activePeriod === '1W') {
      return data.filter(p => !p.time.includes(':')).map(p => p.time)
    }

    if (activePeriod === '1M') {
      const dayTicks = data.filter(p => !p.time.includes(':'))
      return dayTicks.filter((_, i) => i % 7 === 0).map(p => p.time)
    }

    if (activePeriod === '1Y') {
      const seen = new Set<string>()
      return data
        .filter(p => {
          const d = new Date(p.timestamp)
          const key = `${d.getFullYear()}-${d.getMonth()}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
        .map(p => p.time)
    }

    return []
  }, [data, activePeriod])

  const chartConfig = {
    price: {
      label: "Precio",
      color: accent
    }
  }

  return (
    <Card className='w-full bg-zinc-950 border-zinc-800 text-white'>
      <CardHeader>
        <div className="grid flex-1 gap-1">
          <CardDescription>
            {ticker}
          </CardDescription>
          <CardTitle className='text-4xl'>€ {actualPrice.toLocaleString('es-ES')}</CardTitle>
        </div>

        <Select value={activePeriod} onValueChange={(v) => setActivePeriod(v as keyof typeof PERIODS)}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="1D" className="rounded-lg">
              Hoy
            </SelectItem>
            <SelectItem value="1W" className="rounded-lg">
              1 Semana
            </SelectItem>
            <SelectItem value="1M" className="rounded-lg">
              1 Mes
            </SelectItem>
            <SelectItem value="1Y" className="rounded-lg">
              1 Año
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={data}>
          <defs>
            <linearGradient id={ticker} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accent} stopOpacity={0.25} />
              <stop offset="95%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="time"
            ticks={xTicks}
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={formatYTick}
            tickCount={5}
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_value, payload) => {
                    const ts = payload?.[0]?.payload?.timestamp
                    if (!ts) return _value
                    const d = new Date(ts)
                    if (activePeriod === '1Y') {
                      return d.toLocaleString('es-ES', {day: 'numeric', month: 'short'})
                    }
                    return d.toLocaleString('es-ES', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit'
                    })
                  }}
                indicator="dot"
                />
              }
            />
          <Area
            type="monotone"
            dataKey="price"
            stroke={accent}
            strokeWidth={2}
            fill={`url(#${ticker})`}
            dot={false}
            isAnimationActive={isAnimating}
          />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default AssetChart

