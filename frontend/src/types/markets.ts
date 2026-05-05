import type { CandleListResponse } from "@/services/financeService"

export interface OHLCVData {
    open: number
    high: number
    low: number
    close: number
    volume: number
}

export interface AssetConfig {
    id: string
    name: string
    ticker: string
    accent: string
    socketEvent: string
    fetchCandles: (limit: number, interval: string) =>
        Promise<CandleListResponse>
            volumeLabel?: string
}