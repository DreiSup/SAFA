import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Pause, Play } from 'lucide-react'
import { useAudio } from '@/context/AudioContext'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from 'react'
import { financeService } from '@/services/financeService'

const BARS = Array.from({ length: 180 }, (_, i) => {                        
    const pos = i / 179                        // 0.0 → 1.0                 
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

function DataPoint({ label, value, tone, sub }: { label: string, value: string, tone: 'pos' | 'neg' | 'accent', sub: string }) {
    const valueColor =
        tone === 'pos' ? 'var(--s-pos)' :
        tone === 'neg' ? 'var(--s-neg)' :
                         'var(--s-accent)'
    return (
        <div>
            <div className='text-[10px] uppercase tracking-[0.16em] text-s-fg-3 mb-1.5'>{label}</div>
            <div className='font-mono text-[22px] font-medium tracking-tight' style={{ color: valueColor }}>{value}</div>
            <div className='font-mono text-[11px] text-s-fg-3 mt-0.5'>{sub}</div>
        </div>
    )
}

const Report = () => {
    
    const { currentTime, duration, isPlaying, togglePlay, seek} = useAudio()

    const [btcChange, setBtcChange] = useState<string | null>(null)
    const [btcPrice, setBtcPrice] = useState<string | null>(null)
    const [sp500Change, setSp500Change] = useState<string | null>(null)
    const [sp500Price, setSp500Price] = useState<string | null>(null)
    const [sentimentLabel, setSentimentLabel] = useState<string | null>(null)
    const [sentimentScore, setSentimentScore] = useState<string | null>(null)
    const [sentimentTone,  setSentimentTone]  = useState<'pos'|'neg'|'accent'>('accent')

    useEffect(() => {
        const fetchMarketSummary = async () => {
            try {
                const [btcRes, spRes, sentRes] = await Promise.all([
                    financeService.getBitcoinCandles(2, '1h'),
                    financeService.getSP500Candles(2, '1h'),
                    financeService.getSentiment(24),
                ])

                if (btcRes.status === 'success' && btcRes.data.length >= 2) {
                    const [prev, last] = btcRes.data
                    const pct = ((last.close - prev.close) / prev.close) * 100
                    setBtcChange((pct >= 0 ? '+' : '') + pct.toFixed(2) + '%')
                    setBtcPrice(last.close.toLocaleString('es-ES', { maximumFractionDigits: 0 }) + ' EUR')
                }

                if (spRes.status === 'success' && spRes.data.length >= 2) {
                    const [prev, last] = spRes.data
                    const pct = ((last.close - prev.close) / prev.close) * 100
                    setSp500Change((pct >= 0 ? '+' : '') + pct.toFixed(2) + '%')
                    setSp500Price(last.close.toLocaleString('es-ES', { maximumFractionDigits: 2 }))
                }

                if (sentRes.status === 'success') {
                    const btcSent = sentRes.data.bitcoin
                    const labelMap = { positive: 'Optimista', negative: 'Pesimista', neutral: 'Neutral' }
                    const toneMap:  Record<string, 'pos'|'neg'|'accent'> = { positive: 'accent', negative: 'neg', neutral: 'accent' }
                    setSentimentLabel(labelMap[btcSent.label])
                    setSentimentScore((btcSent.score >= 0 ? '+' : '') + btcSent.score.toFixed(2) + ' score')
                    setSentimentTone(toneMap[btcSent.label])
                }
            } catch (err) {
                console.error('Error cargando market summary', err)
            }
        }
        fetchMarketSummary()
    }, 
    [])
    

    const hoy = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })

    const progress = duration ? (currentTime / duration) * 100 : 0
    
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
                <Separator />
                <div className='grid grid-cols-3 gap-4'>
                    <DataPoint label="BTC HOY"    value={btcChange ?? '—'} tone={btcChange?.startsWith('-') ? 'neg' : 'pos'} sub={btcPrice ?? '...'}   />
                    <DataPoint label="S&P 500"     value={sp500Change ?? '—'} tone={sp500Change?.startsWith('-') ? 'neg' : 'pos'} sub={sp500Price ?? '...'}    />
                    <DataPoint label="SENTIMIENTO" value={sentimentLabel ?? '—'} tone={sentimentTone} sub={sentimentScore ?? '...'} />
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

  )
}

export default Report