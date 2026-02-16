import axios from 'axios'
const API_URL = import.meta.env.VITE_PORT

console.log("DEBUG - La URL detectada es:", API_URL); // <--- ESTO ES VITAL
console.log("DEBUG - Todos los env:", import.meta.env);

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
    withCredentials: true
});

export default apiClient