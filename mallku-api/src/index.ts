import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { createDb, type Database } from './db';
import { initResend } from './lib/email';
import { initPosthog, shutdown as shutdownPosthog } from './lib/analytics';
import leadsRouter from './routes/leads';
import analyticsRouter from './routes/analytics';
import authRouter from './routes/auth';
import excursionsRouter from './routes/excursions';
import datesRouter from './routes/dates';
import bookingsRouter from './routes/bookings';
import adminRouter from './routes/admin';
import { authMiddleware } from './lib/auth';
import { getReminderEmailHtml, sendEmail } from './lib/email';

// ==========================================
// TIPOS DE ENTORNO
// ==========================================

type Bindings = {
  // Database
  DATABASE_URL: string;

  // Servicios
  RESEND_API_KEY: string;
  POSTHOG_API_KEY: string;

  // Config
  ADMIN_EMAIL: string;
  JWT_SECRET: string;

  // Ambiente
  ENVIRONMENT: string;
};

type Variables = {
  db: Database;
};

// ==========================================
// APP PRINCIPAL
// ==========================================

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ==========================================
// MIDDLEWARE GLOBAL
// ==========================================

// Logging
app.use('*', logger());

// Security headers
app.use('*', secureHeaders());

// CORS - permitir requests desde el sitio público
app.use(
  '*',
  cors({
    origin: (origin) => {
      // Permitir desde localhost en desarrollo
      if (!origin) return 'https://mallku.com.ar';

      const allowedOrigins = [
        'http://localhost:4321', // Astro dev
        'http://localhost:3000', // Dashboard dev
        'http://localhost:5173', // Vite dev
        'http://localhost:5174', // Vite dev (puerto alternativo)
        'http://localhost:5175', // Vite dev (puerto alternativo)
        'https://mallku.com.ar',
        'https://www.mallku.com.ar',
        'https://admin.mallku.com.ar',
        'https://mallku-admin.vercel.app',
      ];

      return allowedOrigins.includes(origin) ? origin : 'https://mallku.com.ar';
    },
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
    exposeHeaders: ['Content-Length'],
    maxAge: 86400,
    credentials: true,
  })
);

// Inicializar servicios y DB en cada request
app.use('*', async (c, next) => {
  // Soporte para Cloudflare Workers (c.env) y Node.js/Vercel (process.env)
  const dbUrl = c.env?.DATABASE_URL || process.env.DATABASE_URL || '';
  const resendKey = c.env?.RESEND_API_KEY || process.env.RESEND_API_KEY || '';
  const posthogKey = c.env?.POSTHOG_API_KEY || process.env.POSTHOG_API_KEY || '';

  // Inicializar base de datos
  const db = createDb(dbUrl);
  c.set('db', db);

  // Inicializar Resend
  if (resendKey) {
    initResend(resendKey);
  }

  // Inicializar Posthog
  if (posthogKey) {
    initPosthog(posthogKey);
  }

  await next();

  // Cleanup
  await shutdownPosthog();
});

// ==========================================
// RUTAS
// ==========================================

// Health check
app.get('/', (c) => {
  return c.json({
    name: 'Mallku API',
    version: '1.0.0',
    status: 'running',
    environment: c.env?.ENVIRONMENT || process.env.ENVIRONMENT || 'production',
    timestamp: new Date().toISOString(),
  });
});

// Health check detallado
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    services: {
      database: !!(c.env?.DATABASE_URL || process.env.DATABASE_URL),
      email: !!(c.env?.RESEND_API_KEY || process.env.RESEND_API_KEY),
      analytics: !!(c.env?.POSTHOG_API_KEY || process.env.POSTHOG_API_KEY),
    },
    timestamp: new Date().toISOString(),
  });
});

// API v1 - Rutas públicas
app.route('/api/v1/auth', authRouter);
app.post('/api/v1/leads', async (c, next) => await next()); // Lead creation is public
app.route('/api/v1/leads', leadsRouter);
app.route('/api/v1/analytics', analyticsRouter);
app.route('/api/v1/excursions', excursionsRouter);
app.route('/api/v1/dates', datesRouter);
app.post('/api/v1/bookings', async (c, next) => await next()); // Booking creation is public
app.route('/api/v1/bookings', bookingsRouter);

// API v1 - Rutas admin (protegidas)
app.use('/api/v1/admin/*', authMiddleware());
app.route('/api/v1/admin', adminRouter);
app.get('/api/v1/admin/leads', async (c) => {
  const db = c.get('db');
  const { leads } = await import('./db/schema');
  const { desc } = await import('drizzle-orm');

  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const status = c.req.query('status');
  const search = c.req.query('search');

  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));

  let filtered = allLeads;
  if (status) filtered = filtered.filter((l) => l.status === status);
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter((l) =>
      l.nombre.toLowerCase().includes(s) || l.email.toLowerCase().includes(s)
    );
  }

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return c.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

app.get('/api/v1/admin/leads/:id', async (c) => {
  const db = c.get('db');
  const { leads } = await import('./db/schema');
  const { eq } = await import('drizzle-orm');
  const id = c.req.param('id');

  const [lead] = await db.select().from(leads).where(eq(leads.id, id));
  if (!lead) return c.json({ success: false, message: 'Lead no encontrado' }, 404);
  return c.json({ success: true, data: lead });
});

app.patch('/api/v1/admin/leads/:id', async (c) => {
  const db = c.get('db');
  const { leads } = await import('./db/schema');
  const { eq } = await import('drizzle-orm');
  const id = c.req.param('id');
  const data = await c.req.json();

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (data.status) {
    updateData.status = data.status;
    if (data.status === 'contacted') updateData.contactedAt = new Date();
    if (data.status === 'converted') updateData.convertedAt = new Date();
  }
  if (data.notas !== undefined) updateData.notas = data.notas;
  if (data.tags !== undefined) updateData.tags = data.tags;

  const [updated] = await db.update(leads).set(updateData).where(eq(leads.id, id)).returning();
  if (!updated) return c.json({ success: false, message: 'Lead no encontrado' }, 404);
  return c.json({ success: true, data: updated });
});

app.get('/api/v1/admin/stats', async (c) => {
  const db = c.get('db');
  const { leads } = await import('./db/schema');

  const allLeads = await db.select().from(leads);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return c.json({
    success: true,
    data: {
      totalLeads: allLeads.length,
      newToday: allLeads.filter((l) => new Date(l.createdAt) >= today).length,
      byStatus: {
        new: allLeads.filter((l) => l.status === 'new').length,
        contacted: allLeads.filter((l) => l.status === 'contacted').length,
        qualified: allLeads.filter((l) => l.status === 'qualified').length,
        converted: allLeads.filter((l) => l.status === 'converted').length,
        lost: allLeads.filter((l) => l.status === 'lost').length,
      },
    },
  });
});

// ==========================================
// WEBHOOKS (públicos, validados internamente)
// ==========================================

// POST /api/v1/webhooks/mercadopago — Notificaciones de pago de MercadoPago
app.post('/api/v1/webhooks/mercadopago', async (c) => {
  const db = c.get('db');

  const mpAccessToken =
    (c.env as any)?.MP_ACCESS_TOKEN ||
    process.env.MP_ACCESS_TOKEN ||
    '';

  try {
    const body = await c.req.json();

    // MP envía { type: 'payment', data: { id: '...' } }
    const paymentId = body?.data?.id;

    if (!paymentId || !mpAccessToken) {
      return c.json({ received: true });
    }

    // Obtener detalles del pago desde MP
    const { MercadoPagoConfig, Payment } = await import('mercadopago');
    const client = new MercadoPagoConfig({ accessToken: mpAccessToken });
    const paymentApi = new Payment(client);
    const payment = await paymentApi.get({ id: String(paymentId) });

    if (payment.status !== 'approved') {
      console.log(`[Webhook MP] Payment ${paymentId} status: ${payment.status} — skipping`);
      return c.json({ received: true });
    }

    const bookingNumber = payment.external_reference;
    if (!bookingNumber) {
      return c.json({ received: true });
    }

    // Actualizar el booking a pagado
    const { bookings } = await import('./db/schema');
    const { eq } = await import('drizzle-orm');

    await db
      .update(bookings)
      .set({
        paymentStatus: 'paid',
        status: 'paid',
        paymentReference: `MP-${paymentId}`,
        updatedAt: new Date(),
      })
      .where(eq(bookings.bookingNumber, bookingNumber));

    console.log(`[Webhook MP] Booking ${bookingNumber} marcado como pagado (MP-${paymentId})`);
    return c.json({ received: true });
  } catch (err: any) {
    console.error('[Webhook MP] Error:', err.message);
    // Siempre 200 para evitar reintentos de MP
    return c.json({ received: true });
  }
});

// ==========================================
// CRON JOBS (autenticado con CRON_SECRET)
// ==========================================

// GET /api/v1/cron/reminders — Recordatorios automáticos 48h antes
// Vercel agrega Authorization: Bearer CRON_SECRET si está configurado
app.get('/api/v1/cron/reminders', async (c) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = c.req.header('Authorization');

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const db = c.get('db');
  const { dates, excursions, bookings } = await import('./db/schema');
  const { and, gte, lte, eq, ne, or, asc } = await import('drizzle-orm');

  const now = new Date();
  // Buscar fechas entre 24h y 72h desde ahora (ventana alrededor de 48h)
  const windowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 72 * 60 * 60 * 1000);

  const upcomingDates = await db
    .select({
      id: dates.id,
      fecha: dates.fecha,
      horaSalida: dates.horaSalida,
      notas: dates.notas,
      excursionTitulo: excursions.titulo,
    })
    .from(dates)
    .leftJoin(excursions, eq(dates.excursionId, excursions.id))
    .where(
      and(
        gte(dates.fecha, windowStart),
        lte(dates.fecha, windowEnd),
        ne(dates.estado, 'cancelado' as any)
      )
    )
    .orderBy(asc(dates.fecha));

  let totalSent = 0;
  let totalProcessed = 0;

  for (const dateRow of upcomingDates) {
    const confirmedBookings = await db
      .select({
        nombreCompleto: bookings.nombreCompleto,
        email: bookings.email,
      })
      .from(bookings)
      .where(
        and(
          eq(bookings.dateId, dateRow.id),
          or(
            eq(bookings.status, 'confirmed' as any),
            eq(bookings.status, 'paid' as any)
          )
        )
      );

    totalProcessed += confirmedBookings.length;

    for (const booking of confirmedBookings) {
      const html = getReminderEmailHtml({
        nombreCliente: booking.nombreCompleto,
        excursionTitulo: dateRow.excursionTitulo || 'Excursión',
        fecha: dateRow.fecha.toISOString(),
        horaSalida: dateRow.horaSalida || undefined,
        puntoEncuentro: dateRow.notas || undefined,
      });

      const ok = await sendEmail({
        to: booking.email,
        subject: `Recordatorio: tu excursión "${dateRow.excursionTitulo}" - Mallku`,
        html,
      });

      if (ok) totalSent++;
    }
  }

  console.log(`[CRON] Reminders processed: ${totalProcessed}, sent: ${totalSent}`);

  return c.json({
    success: true,
    data: {
      datesFound: upcomingDates.length,
      processed: totalProcessed,
      sent: totalSent,
      timestamp: new Date().toISOString(),
    },
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: 'Endpoint no encontrado',
      path: c.req.path,
    },
    404
  );
});

app.onError((err, c) => {
  console.error('Unhandled error:', err);

  return c.json(
    {
      success: false,
      message: 'Error interno del servidor',
      error: (c.env?.ENVIRONMENT || process.env.ENVIRONMENT) === 'development' ? err.message : undefined,
    },
    500
  );
});

// ==========================================
// EXPORT
// ==========================================

export default app;
