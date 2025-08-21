import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a todas las requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      Cookies.remove('auth_token');
      Cookies.remove('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};

// Reportes services
export const reporteService = {
  crear: async (reporteData) => {
    const response = await api.post('/reportes', reporteData);
    return response.data;
  },
  
  obtenerTodos: async () => {
    const response = await api.get('/reportes');
    return response.data;
  },
  
  obtenerPorId: async (id) => {
    const response = await api.get(`/reportes/${id}`);
    return response.data;
  },
  
  cerrar: async (id, observaciones) => {
    const response = await api.put(`/reportes/${id}/cerrar`, { observaciones });
    return response.data;
  }
};

// Dashboard services
export const dashboardService = {
  obtenerEstadisticas: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  
  exportar: async (formato) => {
    const response = await api.get(`/dashboard/export?formato=${formato}`);
    return response.data;
  }
};

// Mesa de ayuda services
export const mesaAyudaService = {
  buscar: async (palabraClave) => {
    const response = await api.get(`/mesa-ayuda?palabra_clave=${palabraClave}`);
    return response.data;
  },
  
  obtenerTodas: async () => {
    const response = await api.get('/mesa-ayuda/todas');
    return response.data;
  },
  
  crear: async (solucionData) => {
    const response = await api.post('/mesa-ayuda', solucionData);
    return response.data;
  }
};

export default api;