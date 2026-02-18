import axios from 'axios';
import type {
  Excursion,
  CreateExcursionInput,
  Date,
  CreateDateInput,
  Booking,
  CreateBookingFechaFijaInput,
  CreateBookingPersonalizadaInput,
  ReviewPropuestaInput,
  LoginInput,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
} from '@/types';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api/v1';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTH
// ==========================================

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getCurrentUser: (): { email: string; fullName: string; role: string } | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ==========================================
// EXCURSIONES
// ==========================================

export const excursionesApi = {
  getAll: async (): Promise<Excursion[]> => {
    const response = await api.get<ApiResponse<Excursion[]>>('/excursions/admin/all');
    return response.data.data;
  },

  getById: async (id: string): Promise<Excursion> => {
    const response = await api.get<ApiResponse<Excursion>>(`/excursions/admin/${id}`);
    return response.data.data;
  },

  create: async (data: CreateExcursionInput): Promise<Excursion> => {
    const response = await api.post<ApiResponse<Excursion>>('/excursions/admin', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateExcursionInput>): Promise<Excursion> => {
    const response = await api.patch<ApiResponse<Excursion>>(`/excursions/admin/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/excursions/admin/${id}`);
  },
};

// ==========================================
// FECHAS
// ==========================================

export const fechasApi = {
  getAll: async (): Promise<Date[]> => {
    const response = await api.get<ApiResponse<Date[]>>('/dates/admin/all');
    return response.data.data;
  },

  getByExcursion: async (slug: string): Promise<Date[]> => {
    const response = await api.get<ApiResponse<Date[]>>(`/dates/excursions/${slug}/dates`);
    return response.data.data;
  },

  getCalendar: async (params?: {
    month?: number;
    year?: number;
    excursionSlug?: string;
  }): Promise<Date[]> => {
    const response = await api.get<ApiResponse<Date[]>>('/dates/calendar', { params });
    return response.data.data;
  },

  create: async (data: CreateDateInput): Promise<Date> => {
    const response = await api.post<ApiResponse<Date>>('/dates/admin', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateDateInput>): Promise<Date> => {
    const response = await api.patch<ApiResponse<Date>>(`/dates/admin/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/dates/admin/${id}`);
  },
};

// ==========================================
// RESERVAS
// ==========================================

export const reservasApi = {
  getAll: async (params?: {
    tipo?: 'fecha-fija' | 'personalizada';
    status?: string;
    estadoPropuesta?: 'pendiente' | 'aprobada' | 'rechazada';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Booking>> => {
    const response = await api.get<PaginatedResponse<Booking>>('/bookings/admin/all', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/admin/${id}`);
    return response.data.data;
  },

  reviewPropuesta: async (id: string, data: ReviewPropuestaInput): Promise<Booking> => {
    const response = await api.patch<ApiResponse<Booking>>(`/bookings/admin/${id}`, data);
    return response.data.data;
  },

  updateStatus: async (
    id: string,
    data: {
      status?: string;
      paymentStatus?: string;
      notasInternas?: string;
      seniaPagada?: number;
      paymentReference?: string;
    }
  ): Promise<Booking> => {
    const response = await api.patch<ApiResponse<Booking>>(`/bookings/admin/${id}`, data);
    return response.data.data;
  },
};

// ==========================================
// STATS
// ==========================================

export const statsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/stats');
    return response.data.data;
  },
};

export default api;
