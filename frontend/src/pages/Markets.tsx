import { useState, useCallback } from 'react'                                  
  import AssetChart from '@/components/AssetChart'
  import OHLCVCard from '@/components/OHLCVCard'                                 
  import { Button } from '@/components/ui/button'       
  import { ASSETS } from '@/config/assets'                                       
  import type { AssetConfig, OHLCVData } from '@/types/markets'                  
   
  const Markets = () => {                                                        
    const [selectedAsset, setSelectedAsset] = useState<AssetConfig>(ASSETS[0])
    const [ohlcv, setOhlcv] = useState<OHLCVData | null>(null)                   
                                                                                 
    const handleDataLoad = useCallback((data: OHLCVData) => {
      setOhlcv(data)                                                             
    }, [])                                              

    const handleSelectAsset = (asset: AssetConfig) => {                          
      setOhlcv(null)
      setSelectedAsset(asset)                                                    
    }                                                   

    return (
      <div className="flex flex-col gap-6 p-6 min-h-screen bg-zinc-950">
        <div className="flex items-center justify-between">                      
          <h1 className="text-2xl font-bold text-white">Mercados</h1>
                                                                                 
          <div className="flex gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-1">                                                              
            {ASSETS.map((asset) => (                                             
              <Button                                   
                key={asset.id}
                variant={selectedAsset.id === asset.id ? 'default' : 'ghost'}
                size="sm"                                                        
                onClick={() => handleSelectAsset(asset)}
                className={                                                      
                  selectedAsset.id === asset.id         
                    ? 'bg-zinc-700 text-white hover:bg-zinc-600'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'         
                }                                                                
              >                                                                  
                {asset.name}                                                     
              </Button>                                 
            ))}
          </div>
        </div>

        <AssetChart
          key={selectedAsset.id}
          {...selectedAsset}                                                     
          onDataLoad={handleDataLoad}
        />                                                                       
                                                        
        {ohlcv && <OHLCVCard data={ohlcv} accent={selectedAsset.accent} />}      
      </div>
    )                                                                            
  }                                                     

  export default Markets