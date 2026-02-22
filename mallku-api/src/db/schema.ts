import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

// ==========================================
// ENUMS
// ==========================================

export const leadStatusEnum = pgEnum('lead_status', [
  'new',
  'contacted',
  'qualified',
  'converted',
  'lost'
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'paid',
  'completed',
  'cancelled'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'partial',
  'paid',
  'refunded'
]);

export const dateStatusEnum = pgEnum('date_status', [
  'disponible',
  'pocos-cupos',
  'completo',
  'cancelado'
]);

export const bookingTipoEnum = pgEnum('booking_tipo', [
  'fecha-fija',
  'personalizada'
]);

export const propuestaEstadoEnum = pgEnum('propuesta_estado', [
  'pendiente',
  'aprobada',
  'rechazada'
]);

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'staff',
  'viewer'
]);

// ==========================================
// TABLAS
// ==========================================

/**
 * Leads - Contactos interesados capturados desde el sitio
 */
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Datos de contacto
  nombre: varchar('nombre', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  telefono: varchar('telefono', { length: 50 }),

  // Interés
  excursionInteres: varchar('excursion_interes', { length: 255 }),
  mensaje: text('mensaje'),

  // Estado y asignación
  status: leadStatusEnum('status').default('new').notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id),

  // Tracking
  source: varchar('source', { length: 100 }), // 'website', 'whatsapp', 'instagram', etc.
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 100 }),

  // Metadata
  tags: jsonb('tags').$type<string[]>().default([]),
  notas: text('notas'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  contactedAt: timestamp('contacted_at'),
  convertedAt: timestamp('converted_at'),
});

/**
 * Users - Administradores del sistema
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),

  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),

  fullName: varchar('full_name', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('staff').notNull(),

  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Events - Tracking de comportamiento en el sitio
 */
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Identificación
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  leadId: uuid('lead_id').references(() => leads.id),

  // Evento
  eventType: varchar('event_type', { length: 50 }).notNull(), // 'page_view', 'form_submit', 'click', etc.
  eventName: varchar('event_name', { length: 100 }).notNull(),

  // Datos del evento
  properties: jsonb('properties').$type<Record<string, unknown>>().default({}),

  // Contexto
  pageUrl: varchar('page_url', { length: 500 }),
  referrer: varchar('referrer', { length: 500 }),
  userAgent: varchar('user_agent', { length: 500 }),

  // Ubicación (opcional, desde IP)
  country: varchar('country', { length: 100 }),
  city: varchar('city', { length: 100 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Excursions - Catálogo de excursiones disponibles
 */
export const excursions = pgTable('excursions', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),

  titulo: varchar('titulo', { length: 255 }).notNull(),
  subtitulo: varchar('subtitulo', { length: 255 }),
  descripcion: text('descripcion'),
  descripcionLarga: jsonb('descripcion_larga').$type<string[]>().default([]),

  // Detalles
  duracion: varchar('duracion', { length: 100 }),
  precioBase: integer('precio_base'), // En centavos ARS
  grupoMax: integer('grupo_max'),
  dificultad: varchar('dificultad', { length: 50 }),

  // Contenido estructurado
  highlights: jsonb('highlights').$type<string[]>().default([]),
  itinerario: jsonb('itinerario').$type<{hora: string; actividad: string; descripcion: string}[]>().default([]),
  incluye: jsonb('incluye').$type<string[]>().default([]),
  noIncluye: jsonb('no_incluye').$type<string[]>().default([]),
  recomendaciones: jsonb('recomendaciones').$type<string[]>().default([]),

  // Campos adicionales del sitio
  tag: varchar('tag', { length: 100 }),
  salida: varchar('salida', { length: 100 }),
  mejorEpoca: varchar('mejor_epoca', { length: 255 }),
  precio: varchar('precio', { length: 100 }),
  priceNote: varchar('price_note', { length: 255 }),
  whatsappLink: varchar('whatsapp_link', { length: 500 }),

  // Media
  imagenPrincipal: varchar('imagen_principal', { length: 500 }),
  galeria: jsonb('galeria').$type<string[]>().default([]),

  // Estado
  isActive: boolean('is_active').default(true).notNull(),
  orden: integer('orden').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Dates - Fechas de salida disponibles
 */
export const dates = pgTable('dates', {
  id: uuid('id').primaryKey().defaultRandom(),

  excursionId: uuid('excursion_id').references(() => excursions.id).notNull(),

  fecha: timestamp('fecha').notNull(),
  horaSalida: varchar('hora_salida', { length: 10 }),

  cuposTotales: integer('cupos_totales').notNull(),
  cuposReservados: integer('cupos_reservados').default(0).notNull(),

  estado: dateStatusEnum('estado').default('disponible').notNull(),

  // Precio específico para esta fecha (override del base)
  precioOverride: integer('precio_override'),

  notas: text('notas'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Bookings - Reservas de clientes
 */
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Número único de reserva
  bookingNumber: varchar('booking_number', { length: 20 }).unique().notNull(),

  // Tipo de reserva (fecha fija o personalizada)
  tipo: bookingTipoEnum('tipo').notNull(),

  // Referencias
  dateId: uuid('date_id').references(() => dates.id), // Nullable - solo para fecha-fija
  excursionId: uuid('excursion_id').references(() => excursions.id), // Para personalizada
  leadId: uuid('lead_id').references(() => leads.id),

  // Datos del cliente
  nombreCompleto: varchar('nombre_completo', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  telefono: varchar('telefono', { length: 50 }).notNull(),
  dni: varchar('dni', { length: 20 }),

  // Detalles de la reserva
  cantidadPersonas: integer('cantidad_personas').notNull(),
  precioTotal: integer('precio_total'), // Nullable - se calcula cuando se aprueba

  // Campos específicos para tipo='personalizada'
  fechaPropuesta: timestamp('fecha_propuesta'),
  estadoPropuesta: propuestaEstadoEnum('estado_propuesta'),
  motivoRechazo: text('motivo_rechazo'),

  // Estado
  status: bookingStatusEnum('status').default('pending').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('pending').notNull(),

  // Pagos
  seniaPagada: integer('senia_pagada').default(0), // En centavos ARS
  paymentReference: varchar('payment_reference', { length: 255 }),

  // Notas
  notasCliente: text('notas_cliente'),
  notasInternas: text('notas_internas'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  confirmedAt: timestamp('confirmed_at'),
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at'),
});

/**
 * Newsletter Subscribers
 */
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),

  email: varchar('email', { length: 255 }).unique().notNull(),
  nombre: varchar('nombre', { length: 255 }),

  isActive: boolean('is_active').default(true).notNull(),

  source: varchar('source', { length: 100 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  unsubscribedAt: timestamp('unsubscribed_at'),
});

// ==========================================
// TIPOS EXPORTADOS
// ==========================================

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type Excursion = typeof excursions.$inferSelect;
export type NewExcursion = typeof excursions.$inferInsert;

export type DateSalida = typeof dates.$inferSelect;
export type NewDateSalida = typeof dates.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
