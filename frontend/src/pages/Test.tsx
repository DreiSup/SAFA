import AssetChart from '@/components/AssetChart'
import { financeService } from '@/services/financeService'
import React from 'react'

const Test = () => {

    const SP500Prompts = {
        name: "SP500",
        ticker: "SPY",
        accent: "#f7931a", 
        socketEvent:"update_sp500" ,
        fetchCandles: (limit: number, interval: string) => financeService.getSP500Candles(limit, interval),
        volumeLabel: "SP500"
    }

    const BTCPrompts = {
        name: "Bitcoin",
        ticker: "BTCEUR",
        accent: "#f7931a", 
        socketEvent:"update_btc" ,
        fetchCandles: (limit: number, interval: string) => financeService.getBitcoinCandles(limit, interval),
        volumeLabel: "BTC"
    }
  return (
    <>
        <h1>Test</h1>
        <AssetChart {...SP500Prompts}/>
        <AssetChart {...BTCPrompts}/>
    </>
  )
}

export default Test