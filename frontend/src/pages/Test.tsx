import AssetChart from '@/components/AssetChart'
import { financeService } from '@/services/financeService'
import React from 'react'

const Test = () => {

    const assetPrompts = {
        name: "Bitcoin",
        ticker: "BTC",
        accent: "#f7931a", 
        socketEvent:"update_btc" ,
        fetchCandles: (limit: number) => financeService.getBitcoinCandles(limit, "1h"),
        volumeLabel: "BTC"
    }
  return (
    <>
        <h1>Test</h1>
        <AssetChart {...assetPrompts}/>
    </>
  )
}

export default Test