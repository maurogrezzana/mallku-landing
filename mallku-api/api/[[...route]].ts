import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, uuid, varchar, text, timestamp, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Resend } from 'resend';
import postgres from 'postgres';
import { config } from 'dotenv';

config();

// ==========================================
// SCHEMA (inlined to avoid ../src path issues)
// ==========================================

const leadStatusEnum = pgEnum('lead_status', ['new', 'contacted', 'qualified', 'converted', 'lost']);

const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  telefono: varchar('telefono', { length: 50 }),
  excursionInteres: varchar('excursion_interes', { length: 255 }),
  mensaje: text('mensaje'),
  status: leadStatusEnum('status').default('new').notNull(),
  source: varchar('source', { length: 100 }),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 100 }),
  tags: jsonb('tags').$type<string[]>().default([]),
  notas: text('notas'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  contactedAt: timestamp('contacted_at'),
  convertedAt: timestamp('converted_at'),
});

// ==========================================
// VALIDATION
// ==========================================

const createLeadSchema = z.object({
  nombre: z.string().min(2).max(255),
  email: z.string().email().max(255),
  telefono: z.string().max(50).optional(),
  excursionInteres: z.string().max(255).optional(),
  mensaje: z.string().max(2000).optional(),
  source: z.string().max(100).optional().default('website'),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
});

// ==========================================
// HELPERS
// ==========================================

function getEnv(key: string): string {
  return process.env[key] || '';
}

function createDb() {
  const url = getEnv('DATABASE_URL');
  if (!url) throw new Error('DATABASE_URL not configured');
  const client = postgres(url);
  return drizzle(client);
}

let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!resend) {
    const key = getEnv('RESEND_API_KEY');
    if (key) resend = new Resend(key);
  }
  return resend;
}

// ==========================================
// APP
// ==========================================

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return 'https://mallku.com.ar';
    const allowed = [
      'http://localhost:4321',
      'http://localhost:4322',
      'http://localhost:3000',
      'https://mallku.com.ar',
      'https://www.mallku.com.ar',
    ];
    return allowed.includes(origin) ? origin : 'https://mallku.com.ar';
  },
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
  maxAge: 86400,
  credentials: true,
}));

// Health check
app.get('/', (c) => {
  return c.json({
    name: 'Mallku API',
    version: '1.0.0',
    status: 'running',
    environment: getEnv('ENVIRONMENT') || 'production',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    services: {
      database: !!getEnv('DATABASE_URL'),
      email: !!getEnv('RESEND_API_KEY'),
    },
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// LEADS ENDPOINTS
// ==========================================

// POST /api/v1/leads - Create lead (public)
app.post('/api/v1/leads', zValidator('json', createLeadSchema), async (c) => {
  const data = c.req.valid('json');

  try {
    const db = createDb();

    const [newLead] = await db
      .insert(leads)
      .values({
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono || null,
        excursionInteres: data.excursionInteres || null,
        mensaje: data.mensaje || null,
        source: data.source,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
      })
      .returning();

    // Send notification email (async, non-blocking)
    const r = getResend();
    const adminEmail = getEnv('ADMIN_EMAIL') || 'mallkuexcursiones@gmail.com';

    if (r) {
      // Admin notification
      r.emails.send({
        from: 'Mallku CRM <onboarding@resend.dev>',
        to: adminEmail,
        subject: `Nuevo contacto: ${newLead.nombre}`,
        html: `<h2>Nuevo Lead</h2><p><b>Nombre:</b> ${newLead.nombre}</p><p><b>Email:</b> ${newLead.email}</p>${newLead.telefono ? `<p><b>Tel:</b> ${newLead.telefono}</p>` : ''}${newLead.excursionInteres ? `<p><b>Excursión:</b> ${newLead.excursionInteres}</p>` : ''}${newLead.mensaje ? `<p><b>Mensaje:</b> ${newLead.mensaje}</p>` : ''}<p><b>Fuente:</b> ${newLead.source || 'Website'}</p>`,
      }).catch(err => console.error('Email admin error:', err));

      // User confirmation
      r.emails.send({
        from: 'Mallku <onboarding@resend.dev>',
        to: newLead.email,
        subject: '¡Gracias por contactarnos! - Mallku',
        html: `<h2>¡Hola ${newLead.nombre}!</h2><p>Gracias por contactarnos. Recibimos tu mensaje y te responderemos pronto.</p><p>Mientras tanto, podés explorar nuestras excursiones en <a href="https://mallku.com.ar/excursiones">mallku.com.ar</a></p><p><strong>Equipo Mallku</strong></p>`,
      }).catch(err => console.error('Email user error:', err));
    }

    return c.json({
      success: true,
      message: '¡Gracias por contactarnos! Te responderemos pronto.',
      data: { id: newLead.id, nombre: newLead.nombre, email: newLead.email },
    }, 201);
  } catch (error) {
    console.error('Error creating lead:', error);
    return c.json({
      success: false,
      message: 'Error al procesar tu solicitud. Por favor intenta de nuevo.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// GET /api/v1/leads - List leads (for future admin)
app.get('/api/v1/leads', async (c) => {
  try {
    const db = createDb();
    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return c.json({ success: true, data: allLeads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return c.json({ success: false, message: 'Error al obtener leads' }, 500);
  }
});

// 404
app.notFound((c) => {
  return c.json({ success: false, message: 'Endpoint no encontrado', path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ success: false, message: 'Error interno del servidor' }, 500);
});

// ==========================================
// EXPORT
// ==========================================

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
