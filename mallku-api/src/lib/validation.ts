import { z } from 'zod';

// ==========================================
// LEADS
// ==========================================

export const createLeadSchema = z.object({
  nombre: z.string().min(2, 'El nombre es muy corto').max(255),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  excursionInteres: z.string().optional(),
  mensaje: z.string().optional(),
  source: z.string().optional().default('website'),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
  assignedTo: z.string().uuid().optional(),
  notas: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

// ==========================================
// ANALYTICS / EVENTS
// ==========================================

export const trackEventSchema = z.object({
  sessionId: z.string().min(1, 'Session ID requerido'),
  eventType: z.enum(['page_view', 'form_submit', 'click', 'scroll', 'custom']),
  eventName: z.string().min(1),
  properties: z.record(z.unknown()).optional().default({}),
  pageUrl: z.string().url().optional(),
  referrer: z.string().optional(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;

// ==========================================
// EXCURSIONS
// ==========================================

export const itinerarioItemSchema = z.object({
  orden: z.number().int(),
  titulo: z.string().min(1),
  descripcion: z.string().min(1),
  imagen: z.string().optional(),
});

export const createExcursionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  titulo: z.string().min(5, 'El título es muy corto'),
  subtitulo: z.string().optional(),
  descripcion: z.string().min(20, 'La descripción es muy corta'),
  descripcionLarga: z.array(z.string()).optional().default([]),
  duracion: z.string().optional(),
  precioBase: z.number().int().positive().optional(),
  grupoMax: z.number().int().positive(),
  dificultad: z.enum(['baja', 'media', 'alta']).optional(),
  highlights: z.array(z.string()).optional().default([]),
  itinerario: z.array(itinerarioItemSchema).optional().default([]),
  incluye: z.array(z.string()).optional().default([]),
  noIncluye: z.array(z.string()).optional().default([]),
  recomendaciones: z.array(z.string()).optional().default([]),
  imagenPrincipal: z.string().optional(),
  galeria: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  orden: z.number().int().optional().default(0),
});

export const updateExcursionSchema = createExcursionSchema.partial();

export type CreateExcursionInput = z.infer<typeof createExcursionSchema>;
export type UpdateExcursionInput = z.infer<typeof updateExcursionSchema>;

// ==========================================
// DATES
// ==========================================

export const createDateSchema = z.object({
  excursionId: z.string().uuid('ID de excursión inválido'),
  fecha: z.string().datetime('Fecha inválida'),
  horaSalida: z.string().optional(),
  cuposTotales: z.number().int().positive('Cupos totales debe ser positivo'),
  precioOverride: z.number().int().optional(),
  notas: z.string().optional(),
});

export const updateDateSchema = z.object({
  fecha: z.string().datetime().optional(),
  horaSalida: z.string().optional(),
  cuposTotales: z.number().int().positive().optional(),
  estado: z.enum(['disponible', 'pocos-cupos', 'completo', 'cancelado']).optional(),
  precioOverride: z.number().int().optional(),
  notas: z.string().optional(),
});

export type CreateDateInput = z.infer<typeof createDateSchema>;
export type UpdateDateInput = z.infer<typeof updateDateSchema>;

// ==========================================
// BOOKINGS (Dos modalidades)
// ==========================================

export const createBookingSchema = z.discriminatedUnion('tipo', [
  // Modalidad 1: Fecha fija
  z.object({
    tipo: z.literal('fecha-fija'),
    dateId: z.string().uuid('ID de fecha inválido'),
    nombreCompleto: z.string().min(3, 'Nombre completo requerido'),
    email: z.string().email('Email inválido'),
    telefono: z.string().min(8, 'Teléfono inválido'),
    dni: z.string().optional(),
    cantidadPersonas: z.number().int().min(1).max(15, 'Máximo 15 personas'),
    notasCliente: z.string().optional(),
  }),
  // Modalidad 2: Personalizada
  z.object({
    tipo: z.literal('personalizada'),
    excursionSlug: z.string(),
    fechaPropuesta: z.string().datetime('Fecha propuesta inválida'),
    nombreCompleto: z.string().min(3, 'Nombre completo requerido'),
    email: z.string().email('Email inválido'),
    telefono: z.string().min(8, 'Teléfono inválido'),
    dni: z.string().optional(),
    cantidadPersonas: z.number().int().min(1).max(15, 'Máximo 15 personas'),
    notasCliente: z.string().optional(),
  }),
]);

// Schema para aprobar/rechazar propuestas personalizadas
export const reviewPropuestaSchema = z.discriminatedUnion('estadoPropuesta', [
  z.object({
    estadoPropuesta: z.literal('aprobada'),
    dateId: z.string().uuid('ID de fecha inválido'), // La fecha creada para esta propuesta
  }),
  z.object({
    estadoPropuesta: z.literal('rechazada'),
    motivoRechazo: z.string().min(10, 'El motivo debe tener al menos 10 caracteres'),
  }),
]);

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ReviewPropuestaInput = z.infer<typeof reviewPropuestaSchema>;

// ==========================================
// NEWSLETTER
// ==========================================

export const subscribeNewsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  nombre: z.string().optional(),
  source: z.string().optional().default('website'),
});

export type SubscribeNewsletterInput = z.infer<typeof subscribeNewsletterSchema>;

// ==========================================
// AUTH
// ==========================================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña muy corta'),
});

export type LoginInput = z.infer<typeof loginSchema>;
