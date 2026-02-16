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
    }
}