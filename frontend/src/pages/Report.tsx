import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Pause, Play } from 'lucide-react'
import { useState } from 'react'




const BARS = Array.from({ length: 80 }, (_, i) => {                        
    const pos = i / 79                        // 0.0 → 1.0                 
    const envelope = Math.sin(pos * Math.PI)  // 0 → 1 → 0                   
    return 8 + envelope * (15 + Math.random() * 65)                          
  })
  
const TRANSCRIPT = [                                                       
    { time: 0,   text: "Buenos días. Hoy es miércoles 7 de mayo de 2026." },
    { time: 6,   text: "Vamos con tu briefing financiero diario. Durará aproximadamente dos minutos." },
    { time: 14,  text: "Empezamos con los mercados globales." },
    { time: 19,  text: "Bitcoin cotiza a 94.200 dólares, un 2.3% por encima del cierre de ayer." },
    { time: 27,  text: "El volumen de las últimas 24 horas supera los 38.000 millones de dólares." },
    { time: 35,  text: "Ethereum sube un 1.1%, situándose en 3.420 dólares." },
    { time: 43,  text: "El sentimiento en Reddit es mayoritariamente positivo esta semana." },
    { time: 51,  text: "FinBERT detecta un 68% de noticias positivas en las últimas 6 horas." },
    { time: 60,  text: "Pasamos a los mercados tradicionales." },
    { time: 65,  text: "El S&P 500 abrió en verde, subiendo un 0.4% al inicio de sesión." },
    { time: 73,  text: "El sector tecnológico lidera las ganancias, con Nvidia destacando un 3.2%." },
    { time: 82,  text: "El oro se mantiene estable en 2.318 dólares la onza." },
    { time: 89,  text: "Ahora, tu situación personal." },
    { time: 94,  text: "Tu cartera ha ganado un 1.8% en las últimas 24 horas." },
    { time: 102, text: "Tu posición en Bitcoin representa el 34% de tu patrimonio invertido." },
    { time: 110, text: "Sin alertas de rebalanceo por el momento." },
    { time: 116, text: "En cuanto a tus finanzas del mes..." },
    { time: 121, text: "Llevas gastados 1.240 euros de tu presupuesto mensual de 1.800." },
    { time: 130, text: "Tu tasa de ahorro este mes es del 22%, por encima de tu objetivo del 20%." },
    { time: 140, text: "Sin anomalías detectadas en tus movimientos recientes." },
    { time: 147, text: "Para finalizar, una señal a vigilar." },
    { time: 153, text: "La correlación entre BTC y el Nasdaq ha subido al 0.82 esta semana." },
    { time: 162, text: "Esto sugiere menor diversificación real entre tus activos cripto y tecnológicos." },
    { time: 172, text: "Eso es todo por hoy. Que tengas un buen día." },
  ]    

const Report = () => {

    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)


    const hoy = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })

  return (
    <div className="min-h-screen bg-s-bg p-6 flex flex-col gap-6">
        <div className='flex flex-col'>
            <p className='text-[11px] uppercase tracking-widest text-s-fg-3 pb-4'>Reporte de audio</p>
            <h2 className='text-[22px] font-medium tracking-tight text-s-fg'>
                Briefing de hoy
            </h2>
            <h3 className='text-[13px] text-s-fg-2'>{hoy} · Generado a las 07:00</h3>
        </div>
        <Separator />

        <div className='grid grid-cols-[1fr_380px] gap-6 items-start'>
            <Card className='bg-s-bg-1 border-s-border flex flex-col gap-6 p-6'>
                <CardHeader>
                    <CardTitle>Episodio X . Fecha</CardTitle>
                </CardHeader>
                {/* WAVES */}
                <div className='flex items-center gap-[2px] h-20'>
                    {BARS.map((h, i) => {
                        const played = (i / BARS.length) * 100 < progress
                        return (
                            <div
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`flex-1 rounded-sm transition-colors ${played ? 'bg-s-accent' : 'bg-s-bg-3'}`}
                            />
                        )
                    })}
                </div>
                {/* CONTROLES */}
                <div className='flex flex-col gap-3'>
                    <Slider
                        value={[progress]}
                        onValueChange={([val]) => setProgress(val)}
                        max={100}
                        step={0.1}
                        className="w-full"
                    />
                    <div className='flex items-center justify-between'>
                        <span className="text-[12px] text-s-fg-3 font-mono">
                            {Math.floor(progress * 1.2)}s / 2:00
                        </span>
                        <button
                            onClick={() => setPlaying(p => !p)}
                            className="w-9 h-9 rounded-full bg-s-accent flex items-center justify-center"
                        >
                            {playing
                                ? <Pause size={15} className="text-s-accent-fg" />
                                : <Play  size={15} className="text-s-accent-fg fill-s-accent-fg" />
                            }
                        </button>
                        <span className="w-[40px]" />
                    </div>
                </div>
            </Card>

            {/* Transcripción */}
            <Card className='bg-s-bg-1 border-s-border flex flex-col'>
                <div className="p-4 border-b border-s-border">
                    <p className="text-[11px] uppercase tracking-widest text-s-fg-3">Transcripción</p>
                </div>
                <ScrollArea className='h-[360px]'>
                    <div className='flex flex-col gap-1 p-4'>
                        {TRANSCRIPT.map((line, i) => {
                            const active = progress * 1.2 >= line.time &&
                                (i === TRANSCRIPT.length - 1 || progress * 1.2 < TRANSCRIPT[i + 1].time)
                            return (
                                <div key={i}
                                    className={`flex gap-3 p-2 rounded-lg transition-colors ${active ? 'bg-s-bg-2' : ''}`}
                                >
                                    <span className="text-[11px] text-s-fg-3 font-mono w-8 pt-[2px] shrink-0">
                                        {line.time}s
                                    </span>
                                    <p className={`text-[13px] leading-relaxed ${active ? 'text-s-fg' : 'text-s-fg-2'}`}>
                                        {line.text}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    </div>
  )
}

export default Report