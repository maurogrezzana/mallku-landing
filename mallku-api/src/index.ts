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
import { authMiddleware } from './lib/auth';

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
        'https://mallku.com.ar',
        'https://www.mallku.com.ar',
        'https://admin.mallku.com.ar',
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
  // Inicializar base de datos
  const db = createDb(c.env.DATABASE_URL);
  c.set('db', db);

  // Inicializar Resend
  if (c.env.RESEND_API_KEY) {
    initResend(c.env.RESEND_API_KEY);
  }

  // Inicializar Posthog
  if (c.env.POSTHOG_API_KEY) {
    initPosthog(c.env.POSTHOG_API_KEY);
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
    environment: c.env.ENVIRONMENT || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Health check detallado
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    services: {
      database: !!c.env.DATABASE_URL,
      email: !!c.env.RESEND_API_KEY,
      analytics: !!c.env.POSTHOG_API_KEY,
    },
    timestamp: new Date().toISOString(),
  });
});

// API v1 - Rutas públicas
app.route('/api/v1/auth', authRouter);
app.post('/api/v1/leads', async (c, next) => await next()); // Lead creation is public
app.route('/api/v1/leads', leadsRouter);
app.route('/api/v1/analytics', analyticsRouter);

// API v1 - Rutas admin (protegidas)
app.use('/api/v1/admin/*', authMiddleware());
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
      error: c.env.ENVIRONMENT === 'development' ? err.message : undefined,
    },
    500
  );
});

// ==========================================
// EXPORT
// ==========================================

export default app;
