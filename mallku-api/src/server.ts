import { serve } from '@hono/node-server';
import { config } from 'dotenv';

// Cargar variables de entorno desde .env
config();

// Importar app después de cargar env
import app from './index';

const port = parseInt(process.env.PORT || '8787');

console.log(`\n  🦅 Mallku API`);
console.log(`  ─────────────────────`);
console.log(`  Server:    http://localhost:${port}`);
console.log(`  Database:  ${process.env.DATABASE_URL ? '✓ Connected' : '✗ Missing'}`);
console.log(`  Resend:    ${process.env.RESEND_API_KEY ? '✓ Configured' : '✗ Missing'}`);
console.log(`  Posthog:   ${process.env.POSTHOG_API_KEY ? '✓ Configured' : '○ Optional'}`);
console.log(`  ─────────────────────\n`);

serve({
  fetch: (req) => {
    // Inyectar env vars como bindings de Hono
    const env = {
      DATABASE_URL: process.env.DATABASE_URL || '',
      RESEND_API_KEY: process.env.RESEND_API_KEY || '',
      POSTHOG_API_KEY: process.env.POSTHOG_API_KEY || '',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'info@mallku.com.ar',
      JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
      ENVIRONMENT: process.env.ENVIRONMENT || 'development',
    };
    return app.fetch(req, env);
  },
  port,
});
