import apiClient from "./axiosClient"

const api = apiClient

export interface DashboardData {
  balance_total: number;
  desglose_por_categoria: { categoria: string; total: number }[];
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

    /* uploadFile: async (file: File) => {
        try {
            
        } catch (error) {
        
        }
    } */
}