import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { financeService } from "@/services/financeService"
import type { Candle } from "@/services/financeService"

const SP500RealTime = () => {

    const [data, setData] = useState<{ time: string; price: number }[]>([])
    const [precioActual, setPrecioActual] = useState<number>(0)

    useEffect(() => {

      const fetchDataInicial = async () => {
        try {
          // Cargamos velas OHLCV históricas (últimas 720 = 30 días)
          const json = await financeService.getSP500Candles(720)
          if (json.status === "success" && json.data.length > 0) {
            // Cada vela tiene open/high/low/close — mostramos el precio de cierre
            const initialData = json.data.map((candle: Candle) => ({
              time: new Date(candle.timestamp_open * 1000).toLocaleDateString("es-ES"),
              price: candle.close
            }))

            setData(initialData)
            setPrecioActual(initialData[initialData.length - 1].price)
          }
        } catch (error) {
          console.error("Algo ha ido mal al cargar velas iniciales de SP500", error)
        }
      }

      fetchDataInicial()

      // Encender el túnel WebSocket para ticks en tiempo real
      const socket = io("http://localhost:5000")

      socket.on("update_sp500", (nuevoDato) => {
        const date = new Date(nuevoDato.timestamp * 1000)
        const horaFormateada = date.toLocaleTimeString("es-ES")

        const nuevoPunto = {
          time: horaFormateada,
          price: nuevoDato.price
        }

        setPrecioActual(nuevoDato.price)

        // Mantenemos los últimos 200 puntos (velas históricas + ticks recientes)
        setData((prevData) => {
          const newData = [...prevData, nuevoPunto]
          if (newData.length > 200) newData.shift()
          return newData
        })
      })

      return () => {
        socket.disconnect()
      }
    }, [])

  return (
    <>
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>SP500 (Live)</CardTitle>
                <div className="text-2xl font-bold text-green-500">
                ${precioActual.toLocaleString()}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip />
                    <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#f7931a" 
                        strokeWidth={2} 
                        dot={false}
                        isAnimationActive={false} // Evita animaciones raras al actualizar cada 5s
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
            </Card>
    </>
  )
}

export default SP500RealTime