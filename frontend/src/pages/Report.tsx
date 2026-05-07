import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'




const BARS = Array.from({ length: 80 }, (_, i) => {                        
    const pos = i / 79                        // 0.0 → 1.0                 
    const envelope = Math.sin(pos * Math.PI)  // 0 → 1 → 0                   
    return 8 + envelope * (15 + Math.random() * 65)                          
  })
  
  const RAW_TEXT =
      `Reporte Financiero Mensual. Período: abril de 2026.
      
      Buenos días a todos. A continuación se presenta el informe financiero correspondiente al mes
      de abril de 2026, preparado por el área de finanzas corporativas.
      
      Sección uno: Resumen ejecutivo.
      
      Durante el mes de abril, la compañía registró un desempeño sólido en todos sus segmentos de
      negocio. Los ingresos totales alcanzaron 1 millón 250 mil dólares, lo que representa un
      crecimiento del 8 por ciento frente al mes de marzo y un 14 por ciento respecto al mismo
      período del año anterior. Este resultado supera en un 3 por ciento la proyección establecida
      al inicio del trimestre.
      
      Sección dos: Ingresos por segmento.
      
      El segmento de servicios digitales fue el principal motor de crecimiento, aportando 620 mil
      dólares, equivalente al 49.6 por ciento de los ingresos totales. Le sigue el segmento de
      consultoría con 380 mil dólares, y el segmento de licencias de software con 250 mil dólares.
      Los tres segmentos mostraron crecimiento positivo respecto al mes anterior.
      
      Sección tres: Gastos operativos.
      
      Los gastos operativos totales ascendieron a 780 mil dólares. El mayor componente fue el gasto
      en nómina y beneficios al personal, con 420 mil dólares, representando el 53.8 por ciento
      del total de gastos. Los costos de infraestructura tecnológica sumaron 210 mil dólares, y
      las inversiones en marketing y adquisición de clientes alcanzaron 150 mil dólares. Cabe
      destacar que los gastos se mantuvieron dentro del presupuesto aprobado para el período.
      
      Sección cuatro: Rentabilidad y flujo de caja.
      
      La utilidad operativa fue de 470 mil dólares, con un margen del 37.6 por ciento. El flujo
      de caja libre se ubicó en 310 mil dólares, cifra que refuerza la posición de liquidez de la
      empresa. Las cuentas por cobrar pendientes suman 95 mil dólares, todas con vencimiento
      dentro de los próximos 30 días y sin indicios de riesgo de incobrabilidad.
      
      Sección cinco: Proyecciones para mayo de 2026.
      
      Para el mes de mayo se proyecta un crecimiento en ingresos de entre el 5 y el 10 por ciento,
      impulsado principalmente por el lanzamiento oficial del nuevo producto en los mercados de
      México, Colombia y Chile. Adicionalmente, se espera cerrar dos contratos de consultoría de
      largo plazo que sumarían 180 mil dólares en ingresos recurrentes mensuales a partir de junio.
      
      Se recomienda al comité directivo mantener la estrategia de inversión en el segmento digital
      y revisar la estructura de costos de infraestructura en busca de eficiencias adicionales.
      
      Esto concluye el reporte financiero del mes de abril de 2026. Gracias.
      `


const Report = () => {

    const audioRef = useRef<HTMLAudioElement>(null)

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false) 

    useEffect(() => {
          const audio = audioRef.current
          if (!audio) return

          const onTimeUpdate = () => setCurrentTime(audio.currentTime)
          const onLoadMetadata = () => setDuration(audio.duration)
          const onEnded = () => setIsPlaying(false)

          audio.addEventListener('timeupdate', onTimeUpdate)
          audio.addEventListener('loadedmetadata', onLoadMetadata)
          audio.addEventListener('ended', onEnded)
        
          return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate)
            audio.removeEventListener('loadedmetadata', onLoadMetadata)
            audio.removeEventListener('ended', onEnded)
          }
        }, [])
        
    const hoy = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(p => !p)
    }

    const seek = (val: number) => {
        const audio = audioRef.current
        if (!audio) return
        if (duration === 0) return
        audio.currentTime = (val/100)*duration
    }

    const progress = duration ? (currentTime / duration) * 100 : 0
    
    return (
<>
        <audio ref={audioRef} src="/reporte.mp3" preload='metadata'></audio>
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
                        onValueChange={([val]) => seek(val)}
                        max={100}
                        step={0.1}
                        className="w-full"
                        />
                    <div className='flex items-center justify-between'>
                        <span className="text-[12px] text-s-fg-3 font-mono">
                            {Math.floor(currentTime * 1.2)}s / 2:00
                        </span>
                        <button
                            onClick={togglePlay}
                            className="w-9 h-9 rounded-full bg-s-accent flex items-center justify-center"
                            >
                            {isPlaying
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
                        {RAW_TEXT.split('\n\n').map((p, i) => <p key={i} className="text-[13px] leading-relaxed text-s-fg-2 p-2">
                            {p.trim()}                                                                                               
                        </p>)}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    </div>
</>
  )
}

export default Report