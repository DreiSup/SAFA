import type { Report } from "@/data/mockReports";
import apiClient from "./axiosClient"


const api = apiClient

export interface DashboardData {
  balance_total: number;
  desglose_por_categoria: { categoria: string; total: number }[];
}
export interface Transaction {
    id: number;
    fecha: string;    // Viene como string 'YYYY-MM-DD' del backend
    concepto: string;
    monto: number;
    categoria: string;
}
export interface ApiResponse {
    message?: string;
    status?: string;
    error?: string;
    total_borrado?: number; // Específico para el delete all
}
export interface PricePoint {
    asset: string;
    symbol: string;
    price: number;
    timestamp: number;
    source: string;
}
export interface PriceListResponse {
    status: string;
    data: PricePoint[];
}
export interface Candle {
    asset: string;
    symbol: string;
    interval: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp_open: number;
    timestamp_close: number;
    source: string;
}
export interface CandleListResponse {
    status: string;
    count: number;
    data: Candle[];
}

export interface SentimentData {
    score: number
    label: 'positive' | 'negative' | 'neutral'
    n: number
}

export interface SentimentResponse {
    status: string
    since_hours: number
    data: { bitcoin: SentimentData; sp500: SentimentData; general_macro: SentimentData}
}

interface ReportApiResponse {
      id: string
      date: string
      label: string
      text: string
      audio_path: string
    }

export const financeService = {

    getDashboard: async (): Promise<DashboardData> => {
        try {
            const response = await api.get<DashboardData>('/finance/dashboard')
            console.log(response)
            return response.data
        } catch (error) {
            console.error("Error en financeService.getDashboard:", error)
            throw error;
        }
    },

    getTransactions: async (): Promise<Transaction[]> => {
        try {
            const response = await api.get<Transaction[]>('/finance/transactions')
            console.log(response)
            return response.data
        } catch (error) {
            console.error("Error en financeService.getDashboard:", error)
            throw error;
        }
    },

    uploadFile: async (file: File): Promise<ApiResponse> => {
        const formData = new FormData()
        formData.append('file', file);
        try {
            const response = await api.post<ApiResponse>('/finance/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            })
            return response.data;
        } catch (error) {
            console.error("Error en uploadFile:", error)
            throw Error
        }
    },

    deleteTransaction: async (id: number): Promise<ApiResponse> => {
        try {
            const response = await api.post<ApiResponse>(`/finance/transactions/${id}`)
            return response.data;
        } catch (error) {
            console.error(`Error borrando transacción ${id}:`, error);
            throw error;
        }
    },

    deleteAllTransactions: async (): Promise<ApiResponse> => {
        try {
            const response = await api.post<ApiResponse>('/finance/transactions')
            return response.data;
        } catch (error) {
            console.error("Error borrando todo:", error);
            throw error;
        }
    },
    
    getBitcoinCandles: async (limit: number = 720, interval: string): Promise<CandleListResponse> => {
        try {
            const response = await api.get<CandleListResponse>('/v1/macro/btc/candles', { params: { limit, interval } })
            return response.data;
        } catch (error) {
            console.error("Error en getBitcoinCandles:", error);
            throw error;
        }
    },

    getSP500Candles: async (limit: number = 720, interval: string): Promise<CandleListResponse> => {
        try {
            const response = await api.get<CandleListResponse>('/v1/macro/sp500/candles', { params: { limit, interval } })
            return response.data;
        } catch (error) {
            console.error("Error en getSP500Candles:", error);
            throw error;
        }
    },

    getSentiment: async (sinceHours = 24): Promise<SentimentResponse> => {
        const res = await apiClient.get(`v1/macro/sentiment?since=${sinceHours}`)
        return res.data
    },

    generateReport: async (): Promise<Report> => {
        try{
            const response = await api.post<ReportApiResponse>('/v1/report/generate')
            const data = response.data
            return {
                id: data.id,
                date: data.date,
                label: data.label,
                audioSrc: 'http://127.0.0.1:5000' + data.audio_path,
                transcript: data.text,
                listened: false
            }
        } catch (error) {
            console.error('Error en generateReport:', error);
            throw error
        }
    }, 

    getReports: async (): Promise<Report[]> => {
        try {
            const response = await api.get<ReportApiResponse[]>('v1/report/list')
            return response.data.map((r => ({
                id: r.id,
                date: r.date,
                label: r.label,
                audioSrc: 'http://127.0.0.1:5000' + r.audio_path,
                transcript: r.text,
                listened: false
            })))
        } catch (error) {
            console.error("Error en getReports: ", error)
            throw error
        }
    }
}


