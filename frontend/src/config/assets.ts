import { financeService } from "@/services/financeService";
import type { AssetConfig } from "@/types/markets";

export const ASSETS: AssetConfig[] = [
    {
        id:'btc',
        name: 'Bitcoin',
        ticker: 'BTCEUR',
        accent: '#f7931a',
        socketEvent: 'update_btc',
        fetchCandles: (limit, interval) => financeService.getBitcoinCandles(limit, interval),
        volumeLabel: 'BTC'
    },
    {
        id:'sp500',
        name: 'S&P 500',
        ticker: 'SPY',
        accent: '#6366f1',
        socketEvent: 'update_sp500',
        fetchCandles: (limit, interval) => financeService.getSP500Candles(limit, interval),
        volumeLabel: 'BTC'
    }
]