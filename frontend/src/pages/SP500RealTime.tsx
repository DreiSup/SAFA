import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const SP500RealTime = () => {

    const [data, setData] = useState<any[]>([])
    const [precioActual, setPrecioActual] = useState<number>(0)

    useEffect(() => {

      const fetchDataInicial = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/v1/macro/sp500/recent?limit=90")
          const json = await response.json()
          if (json.status === "success" && json.data.length > 0) {
            //Formateamos datos igual que en Websocket
            const initialData = json.data.map((item: any) => ({
              time: new Date(item.timestamp * 1000).toLocaleDateString("es-ES"),
              price: item.price
            }))

            setData(initialData)
            setPrecioActual(initialData[initialData.length - 1].price)
          }
        } catch (error) {
          console.error("Algo ha ido mal al cargar datos iniciales de SP500", error)
        }
      }

      fetchDataInicial()

      // 1. Opcional: Cargar los últimos 50 puntos vía REST para no empezar con la gráfica en blanco
      // fetch("http://localhost:5000/api/v1/macro/sp500?limit=50")...

      // 2. Encender el túnel
      const socket = io("http://localhost:5000")

      socket.on("update_sp500", (nuevoDato) => {
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