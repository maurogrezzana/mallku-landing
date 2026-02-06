const API_BASE = '/api/v1';

function getToken(): string | null {
  return localStorage.getItem('mallku_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('mallku_token');
      localStorage.removeItem('mallku_user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Error en la solicitud');
  }

  return data;
}

// ==========================================
// AUTH
// ==========================================

export async function login(email: string, password: string) {
  return request<{
    success: boolean;
    data: {
      token: string;
      user: { id: string; email: string; fullName: string; role: string };
    };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function setup(email: string, password: string) {
  return request<{
    success: boolean;
    data: {
      token: string;
      user: { id: string; email: string; fullName: string; role: string };
    };
  }>('/auth/setup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ==========================================
// LEADS
// ==========================================

export interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  excursionInteres: string | null;
  mensaje: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string | null;
  tags: string[];
  notas: string | null;
  createdAt: string;
  updatedAt: string;
  contactedAt: string | null;
  convertedAt: string | null;
}

export async function getLeads(params?: { page?: number; status?: string; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.status) searchParams.set('status', params.status);
  if (params?.search) searchParams.set('search', params.search);

  const query = searchParams.toString();
  return request<{
    success: boolean;
    data: Lead[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(`/admin/leads${query ? `?${query}` : ''}`);
}

export async function getLead(id: string) {
  return request<{ success: boolean; data: Lead }>(`/admin/leads/${id}`);
}

export async function updateLead(id: string, data: { status?: string; notas?: string; tags?: string[] }) {
  return request<{ success: boolean; data: Lead }>(`/admin/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ==========================================
// STATS
// ==========================================

export interface Stats {
  totalLeads: number;
  newToday: number;
  byStatus: {
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
  };
}

export async function getStats() {
  return request<{ success: boolean; data: Stats }>('/admin/stats');
}
