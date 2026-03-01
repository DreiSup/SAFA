import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
     ChartContainer,
     ChartTooltip,
     ChartTooltipContent,
    type ChartConfig 
} from "@/components/ui/chart"


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
            // Promise,all ejecuta ambas peticiones en paralelo
            const [btcResponse, sp500Response] = await Promise.all([
                fetch("http://localhost:5000/api/v1/macro/bitcoin"),
                fetch("http://localhost:5000/api/v1/macro/sp500")
            ])

            const btcJson = await btcResponse.json()
            const sp500Json = await sp500Response.json()
            
            if (btcJson.status === "success" && sp500Json.status === "success") {
                //Creamos un diccionario para agrupar los datos por fecha
                const mergedDataMap = new Map()

                //Procesamos Bitcoin
                btcJson.data.forEach((item: any) => {
                    const date = new Date(item.timestamp * 1000)
                    const dateKey = date.toLocaleDateString("es-Es", { month: "short", day: "numeric"})
                    mergedDataMap.set(dateKey, { formattedDate: dateKey, btc: item.price })
                })

                // Procesamos S&P 500 y lo fusionamos con el Bitcoin en la misma fecha
                sp500Json.data.forEach((item: any) => {
                    const date = new Date(item.timestamp * 1000)
                    const dateKey = date.toLocaleDateString("es-ES", { month: "short", day: "numeric" })
                    
                    if (mergedDataMap.has(dateKey)) {
                        // Si ya existe la fecha (por el BTC), le añadimos el precio del SP500
                        const existing = mergedDataMap.get(dateKey)
                        existing.sp500 = item.price
                        mergedDataMap.set(dateKey, existing)
                    }
                })

                // Convertimos el mapa de vuelta a un array para Recharts
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