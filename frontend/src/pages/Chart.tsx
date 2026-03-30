import { useEffect, useState } from "react"
import { CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
     ChartContainer,
     ChartTooltip,
     ChartTooltipContent,
    type ChartConfig
} from "@/components/ui/chart"
import { financeService } from "@/services/financeService"


const chartConfig = {
    btc: {
        label: "Precio BTC ($)",
        color: "hsl(var(--chart-3))", // Usa los colores de tu tema de Shadcn
        
    },
    sp500: {
        label: "Precio S&P500 ($)",
        color: "hsl(var(--chart-1))", // Usa los colores de tu tema de Shadcn
  },
} satisfies ChartConfig

const Chart = () => {

    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMarketData = async () => {
        try {
            // Promise.all ejecuta ambas peticiones en paralelo
            const [btcJson, sp500Json] = await Promise.all([
                financeService.getBitcoinCandles(720),
                financeService.getSP500Candles(720)
            ])

            if (btcJson.status === "success" && sp500Json.status === "success") {
                // Agrupamos por fecha usando timestamp_open de la vela
                const mergedDataMap = new Map()

                btcJson.data.forEach((candle) => {
                    const dateKey = new Date(candle.timestamp_open * 1000).toLocaleDateString("es-ES", { month: "short", day: "numeric" })
                    mergedDataMap.set(dateKey, { formattedDate: dateKey, btc: candle.close })
                })

                sp500Json.data.forEach((candle) => {
                    const dateKey = new Date(candle.timestamp_open * 1000).toLocaleDateString("es-ES", { month: "short", day: "numeric" })
                    if (mergedDataMap.has(dateKey)) {
                        mergedDataMap.get(dateKey).sp500 = candle.close
                    }
                })

                setData(Array.from(mergedDataMap.values()))
            }
        } catch (error) {
            console.error("Error cargando datos macroeconómicos:", error)
        } finally {
            setLoading(false)
        }
        }
        fetchMarketData()
    }, [])

  return (
    <>
        <Card className="w-full">
        <CardHeader>
            <CardTitle>Mercado Macro: Riesgo vs Tradición</CardTitle>
            <CardDescription>Correlación a 30 días (Bitcoin & S&P 500)</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
            <div className="h-[300px] flex items-center justify-center">Cargando flujos de mercado...</div>
            ) : (
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <AreaChart accessibilityLayer data={data} margin={{top: 20, left: 10, right: 10, bottom: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    
                    <XAxis 
                        dataKey="formattedDate" 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={10}
                        minTickGap={30}
                    />
                    
                    {/* 3. CORRECCIÓN: Añadimos Ejes Y invisibles para independizar las escalas */}
                    <YAxis yAxisId="left" domain={['auto', 'auto']} hide />
                    <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} hide />

                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    
                    <defs>
                        {/* 4. CORRECCIÓN: Colores arreglados en los gradientes */}
                        <linearGradient id="fillBtc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-btc)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--color-btc)" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="fillSp500" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-sp500)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--color-sp500)" stopOpacity={0.0}/>
                        </linearGradient>
                    </defs>

                    {/* 5. CORRECCIÓN: Quitamos stackId y atamos a su eje correspondiente */}
                    <Area
                        yAxisId="left"
                        dataKey="btc"
                        type="monotone"
                        fill="url(#fillBtc)"
                        stroke="var(--color-btc)"
                        strokeWidth={2}
                    />
                    <Area
                        yAxisId="right"
                        dataKey="sp500"
                        type="monotone"
                        fill="url(#fillSp500)"
                        stroke="var(--color-sp500)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
            )}
        </CardContent>
    </Card>
    </>
  )
}

export default Chart