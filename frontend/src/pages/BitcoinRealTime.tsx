import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BitcoinRealTime = () => {

    const [data, setData] = useState<any[]>([])
    const [precioActual, setPrecioActual] = useState<number>(0)

    useEffect(() => {
    // 1. Opcional: Cargar los últimos 50 puntos vía REST para no empezar con la gráfica en blanco
    // fetch("http://localhost:5000/api/v1/macro/bitcoin?limit=50")...

    // 2. Encender el túnel
    const socket = io("http://localhost:5000")

    socket.on("update_btc", (nuevoDato) => {
      const date = new Date(nuevoDato.timestamp * 1000)
      const horaFormateada = date.toLocaleTimeString("es-ES") 
      
      const nuevoPunto = {
        time: horaFormateada,
        price: nuevoDato.price
      }
      
      setPrecioActual(nuevoDato.price)

      // Actualizamos la gráfica manteniendo solo los últimos 20 puntos para que fluya
      setData((prevData) => {
        const newData = [...prevData, nuevoPunto]
        if (newData.length > 20) newData.shift() // Borra el más antiguo
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
                <CardTitle>Bitcoin (Live)</CardTitle>
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

export default BitcoinRealTime