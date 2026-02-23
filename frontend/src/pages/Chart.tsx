import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"


const chartConfig = {
  price: {
    label: "Precio BTC ($)",
    color: "hsl(var(--chart-1))", // Usa los colores de tu tema de Shadcn
  },
}

const Chart = () => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBitcoinData = async () => {
        try {
            // Llama al endpoint exacto que creamos
            const response = await fetch("http://localhost:5000/api/v1/macro/bitcoin")
            const json = await response.json()
            
            if (json.status === "success") {
            // Formateamos un poco el timestamp para que sea legible en la gráfica
            const formattedData = json.data.map((item: any) => {
                const date = new Date(item.timestamp * 1000) // Multiplicamos por 1000 para pasar a milisegundos
                return {
                ...item,
                formattedDate: date.toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
                time: date.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })
                }
            })
            setData(formattedData)
            }
        } catch (error) {
            console.error("Error cargando los datos de Bitcoin:", error)
        } finally {
            setLoading(false)
        }
        }

        fetchBitcoinData()
    }, [])

  return (
    <>
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Rendimiento Histórico - Bitcoin (BTC/USDT)</CardTitle>
                <CardDescription>Últimos 30 días cargados desde MongoDB</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                <div className="h-[300px] flex items-center justify-center">Cargando datos del mercado...</div>
                ) : (
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <LineChart data={data} margin={{ top: 20, left: 10, right: 10, bottom: 20 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="formattedDate" 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8}
                        minTickGap={30} // Evita que los textos se amontonen
                    />
                    <YAxis 
                        domain={['auto', 'auto']} // Ajusta el eje Y al precio máximo y mínimo automáticamente
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                        tickLine={false}
                        axisLine={false}
                        width={80}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="var(--color-price)"
                        strokeWidth={2}
                        dot={false} // Quitamos los puntos individuales para que la línea se vea limpia
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