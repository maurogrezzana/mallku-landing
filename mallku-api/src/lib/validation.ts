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
// BOOKINGS
// ==========================================

export const createBookingSchema = z.object({
  dateId: z.string().uuid('ID de fecha inválido'),
  nombreCompleto: z.string().min(3, 'Nombre completo requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  dni: z.string().optional(),
  cantidadPersonas: z.number().int().min(1).max(20),
  notasCliente: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

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
