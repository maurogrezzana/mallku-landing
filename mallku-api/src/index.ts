import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { createDb, type Database } from './db';
import { initResend } from './lib/email';
import { initPosthog, shutdown as shutdownPosthog } from './lib/analytics';
import leadsRouter from './routes/leads';
import analyticsRouter from './routes/analytics';

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

// API v1
app.route('/api/v1/leads', leadsRouter);
app.route('/api/v1/analytics', analyticsRouter);

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
