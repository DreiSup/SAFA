import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"


const chartConfig = {
    btc: {
        label: "Precio BTC ($)",
        color: "hsl(var(--chart-1))", // Usa los colores de tu tema de Shadcn
        
    },
    sp500: {
        label: "Precio S&P500 ($)",
        color: "hsl(var(--chart-2))", // Usa los colores de tu tema de Shadcn
  },
}

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
                    mergedDataMap.set(dateKey, { formattedDate: dateKey, price_btc: item.price })
                })

                // Procesamos S&P 500 y lo fusionamos con el Bitcoin en la misma fecha
                sp500Json.data.forEach((item: any) => {
                    const date = new Date(item.timestamp * 1000)
                    const dateKey = date.toLocaleDateString("es-ES", { month: "short", day: "numeric" })
                    
                    if (mergedDataMap.has(dateKey)) {
                    // Si ya existe la fecha (por el BTC), le añadimos el precio del SP500
                    const existing = mergedDataMap.get(dateKey)
                    existing.price_sp500 = item.price
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
                    <LineChart data={data} margin={{ top: 20, left: 10, right: 10, bottom: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="formattedDate" 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8}
                        minTickGap={30} 
                    />
                    
                    {/* EJE Y 1 (Izquierda) para Bitcoin */}
                    <YAxis 
                        yAxisId="left"
                        domain={['auto', 'auto']} 
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        tickLine={false}
                        axisLine={false}
                        width={80}
                    />
                    
                    {/* EJE Y 2 (Derecha) para S&P 500 */}
                    <YAxis 
                        yAxisId="right"
                        orientation="right"
                        domain={['auto', 'auto']} 
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        tickLine={false}
                        axisLine={false}
                        width={60}
                    />

                    <Tooltip content={<ChartTooltipContent />} />
                    
                    {/* Línea del Bitcoin atada al eje izquierdo */}
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="price_btc"
                        stroke="var(--color-btc)"
                        strokeWidth={2}
                        dot={false} 
                    />
                    
                    {/* Línea del S&P 500 atada al eje derecho */}
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="price_sp500"
                        stroke="var(--color-sp500)"
                        strokeWidth={2}
                        dot={false} 
                    />
                    </LineChart>
                </ChartContainer>
                )}
            </CardContent>
            </Card>
    </>
  )
}

export default Chart