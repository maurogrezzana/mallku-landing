/**
 * Script para crear el usuario admin inicial
 * Uso: npm run create-admin
 */
import { config } from 'dotenv';
config();

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { users } from '../src/db/schema';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no definida en .env');
  process.exit(1);
}

// ── Config del admin ──────────────────────────────────────
const ADMIN_EMAIL    = 'admin@mallku.com.ar';
const ADMIN_PASSWORD = 'Mallku2024!';
const ADMIN_NAME     = 'Administrador Mallku';
// ─────────────────────────────────────────────────────────

async function main() {
  const client = postgres(DATABASE_URL!);
  const db = drizzle(client);

  console.log('\n  🦅 Mallku Admin Setup');
  console.log('  ─────────────────────────');

  // Verificar si ya existe
  const existing = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL));

  if (existing.length > 0) {
    console.log(`  ℹ️  Ya existe un usuario con ${ADMIN_EMAIL}`);
    console.log(`  📧 Email: ${ADMIN_EMAIL}`);
    console.log(`  🔑 Usá la contraseña que configuraste\n`);
    await client.end();
    return;
  }

  // Hashear contraseña
  console.log('  ⏳ Hasheando contraseña...');
  const passwordHash = await hash(ADMIN_PASSWORD, 10);

  // Insertar usuario
  const [newUser] = await db.insert(users).values({
    email: ADMIN_EMAIL,
    passwordHash,
    fullName: ADMIN_NAME,
    role: 'admin',
    isActive: true,
  }).returning();

  console.log('  ✅ Usuario admin creado exitosamente');
  console.log('  ─────────────────────────');
  console.log(`  📧 Email:    ${newUser.email}`);
  console.log(`  🔑 Password: ${ADMIN_PASSWORD}`);
  console.log(`  👤 Nombre:   ${newUser.fullName}`);
  console.log(`  🛡️  Rol:      ${newUser.role}`);
  console.log('  ─────────────────────────\n');

  await client.end();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
