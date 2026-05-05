import type { OHLCVData } from "@/types/markets"
import {Card, CardContent, CardHeader, CardTitle} from './ui/card'

interface OHLCVCardProps {
    data: OHLCVData,
    accent?: string
}

const formatValue = (v: number) => v.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})

const formatVolume = (v: number) => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}B`
    if (v >= 1_000_000)     return `${(v / 1_000_000).toFixed(2)}M`              
    if (v >= 1_000)         return `${(v / 1_000).toFixed(1)}K`                  
    return v.toFixed(2)
}

const FIELDS = [
    {key: 'open', label: 'Apertura'},
    { key: 'high',   label: 'Máximo'   },
    { key: 'low',    label: 'Mínimo'   },                                        
    { key: 'close',  label: 'Cierre'   },
    { key: 'volume', label: 'Volumen'  },     
] as const

const OHLCVCard = ({ data, accent }: OHLCVCardProps) => (
    <Card className="w-full bg-zinc-950 border-zinc-800 text-white">
        <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
                Resumen del periodo
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-5 divide-x divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-900/50">
                {FIELDS.map(({key, label}) => (
                    <div key={key} className="flex flex-col items-center py-3 px-2">
                        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                            {label}
                        </span>
                        <span                                                              
                            className="mt-1 text-sm font-semibold"
                            style={{                                                         
                            color: key === 'high' ? '#34d399' : key === 'low' ? '#f87171' :'#f4f4f5'                                                                     
                            }}
                        >                                                                  
                            {key === 'volume' ? formatVolume(data[key]) : formatValue(data[key])}                                                        
                        </span>
                    </div>

                ))}
            </div>
        </CardContent>
    </Card>
)

export default OHLCVCard