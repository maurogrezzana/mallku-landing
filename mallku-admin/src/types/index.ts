// ==========================================
// EXCURSIONES
// ==========================================

export interface Excursion {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  descripcionLarga: string[];
  duracion: string;
  precioBase: number; // en centavos
  grupoMax: number;
  dificultad: 'baja' | 'media' | 'alta';
  highlights: string[];
  itinerario: ItinerarioItem[];
  incluye: string[];
  noIncluye: string[];
  recomendaciones: string[];
  imagenPrincipal: string | null;
  galeria: string[];
  isActive: boolean;
  orden: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItinerarioItem {
  orden: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
}

export interface CreateExcursionInput {
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  descripcionLarga: string[];
  duracion: string;
  precioBase: number;
  grupoMax: number;
  dificultad: 'baja' | 'media' | 'alta';
  highlights: string[];
  itinerario: ItinerarioItem[];
  incluye: string[];
  noIncluye: string[];
  recomendaciones: string[];
  orden?: number;
}

// ==========================================
// FECHAS
// ==========================================

export interface Date {
  id: string;
  excursionId: string;
  excursionSlug?: string;
  excursionTitulo?: string;
  fecha: string;
  horaSalida: string;
  cuposTotales: number;
  cuposReservados: number;
  cuposDisponibles?: number;
  estado: 'disponible' | 'pocos-cupos' | 'completo' | 'cancelado';
  precioOverride: number | null;
  precioBase?: number;
  notas: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDateInput {
  excursionId: string;
  fecha: string;
  horaSalida: string;
  cuposTotales: number;
  precioOverride?: number;
  notas?: string;
}

// ==========================================
// RESERVAS
// ==========================================

export type BookingTipo = 'fecha-fija' | 'personalizada';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PropuestaEstado = 'pendiente' | 'aprobada' | 'rechazada';
export type PaymentStatus = 'pending' | 'partial' | 'paid';

export interface Booking {
  id: string;
  bookingNumber: string;
  tipo: BookingTipo;
  dateId: string | null;
  excursionId: string;
  leadId: string | null;

  // Cliente info
  nombreCompleto: string;
  email: string;
  telefono: string;
  dni: string | null;
  cantidadPersonas: number;

  // Propuesta personalizada
  fechaPropuesta: string | null;
  estadoPropuesta: PropuestaEstado | null;
  motivoRechazo: string | null;

  // Reserva info
  precioTotal: number | null;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  seniaPagada: number;
  paymentReference: string | null;

  // Notas
  notasCliente: string | null;
  notasInternas: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;

  // Join data (cuando se hace query con join)
  excursionTitulo?: string;
  excursionSlug?: string;
  fecha?: string | null;
  horaSalida?: string | null;
}

export interface CreateBookingFechaFijaInput {
  tipo: 'fecha-fija';
  dateId: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  cantidadPersonas: number;
  dni?: string;
  notasCliente?: string;
}

export interface CreateBookingPersonalizadaInput {
  tipo: 'personalizada';
  excursionSlug: string;
  fechaPropuesta: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  cantidadPersonas: number;
  dni?: string;
  notasCliente?: string;
}

export interface ReviewPropuestaInput {
  estadoPropuesta: 'aprobada' | 'rechazada';
  dateId?: string; // Required if aprobada
  motivoRechazo?: string; // Required if rechazada
}

// ==========================================
// AUTH
// ==========================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'staff';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

// ==========================================
// API RESPONSES
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, any>;
}

// ==========================================
// ALERTAS / PRÓXIMAS SALIDAS
// ==========================================

export interface UpcomingBooking {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  cantidadPersonas: number;
  status: string;
  paymentStatus: string;
}

export interface UpcomingDate {
  date: {
    id: string;
    fecha: string;
    horaSalida: string | null;
    cuposTotales: number;
    cuposReservados: number;
    estado: string;
    notas: string | null;
  };
  excursion: {
    id: string | null;
    titulo: string | null;
    slug: string | null;
  };
  bookings: UpcomingBooking[];
}

// ==========================================
// STATS
// ==========================================

export interface DashboardStats {
  totalExcursiones: number;
  totalFechas: number;
  totalReservas: number;
  reservasPendientes: number;
  propuestasPendientes: number;
  ingresosMes: number;
}
