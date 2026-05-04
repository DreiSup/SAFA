import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'
import type { CandleListResponse } from '@/services/financeService'
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
}

interface ChartPoint {
  time: string,
  price: number
}

type ViewMode = 'gradient' | 'linear'

const PERIODS = {
  "1D": {interval: "1m", limit: 480, timerMs: 60000},
  "1W": {interval: "1h", limit: 168, timerMs: 3600000},
  "1M": {interval: "1h", limit: 720, timerMs: 3600000},
  "1Y": {interval: "1d", limit: 365, timerMs: 86400000}
}

const AssetChart = ({name, ticker, accent, socketEvent, fetchCandles, volumeLabel} : AssetChartProps) => {

  const [data, setData] = useState<ChartPoint[]>([])
  const [actualPrice, setActualPrice] = useState(0)
  const [initialPrice, setInitialPrice] = useState(0)
  const [high, setHigh] = useState(0)
  const [low, setLow] = useState(0)
  const [volume, setVolume] = useState(0)
  const [isLive, setIsLive] = useState(false)
  const [activePeriod, setActivePeriod] = useState<keyof typeof PERIODS>('1D')
  const [viewMode, setViewMode] = useState<ViewMode>('gradient')

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

              return { time, price: candle.close}
            })
            console.log(chartData)
            setData(chartData)
            setInitialPrice(chartData[0].price)
            setActualPrice(chartData[chartData.length - 1].price)
            // .map devuelve [], pero Math.max necesita argumentos separados por comas, por tanto se usa ... para spread
            setHigh(Math.max(...candles.map(c => c.high)))
            setLow(Math.min(...candles.map(c => c.low)))
            setVolume(candles[candles.length - 1].volume ?? 0)
            lastTimestamp.current = candles[candles.length - 1].timestamp_open
          }
      }
      catch (err) {
        console.log("Error cargando velas", err)
      }
    }
    loadData()
  }, [activePeriod, fetchCandles])

  //websocket
  useEffect(() => {
    const socket = io("http://localhost:5000")
    
    socket.on("connect", () => setIsLive(true))
    socket.on("disconnect", () => setIsLive(false))
    socket.on(socketEvent, (d) => setActualPrice(d.price))
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
                  
      setData(prev => [...prev.slice(1), { time, price: newCandle.close }])                                        
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
            BTC - EUR
          </CardDescription>
          <CardTitle className='text-4xl'>66.789€</CardTitle>
        </div>

        <Select value={activePeriod} onValueChange={setActivePeriod}>
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
          <CartesianGrid/>
          <XAxis dataKey="time" interval={Math.floor(data.length / 6)} />
          <YAxis domain={['auto', 'auto']} />
          <ChartTooltip />
          <Area dataKey="price" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default AssetChart