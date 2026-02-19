import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

async function check() {
  try {
    // Ver si existe la tabla users
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
    `;

    if (tables.length === 0) {
      console.log('❌ Tabla users NO existe');
      await sql.end();
      return;
    }

    console.log('✅ Tabla users existe\n');

    // Ver usuarios
    const users = await sql`
      SELECT id, email, full_name, role, is_active, created_at::text
      FROM users
    `;

    if (users.length === 0) {
      console.log('📭 No hay usuarios en la base de datos');
      console.log('   → Usar POST /api/v1/auth/setup para crear el primer admin');
    } else {
      console.log(`👥 Usuarios encontrados (${users.length}):\n`);
      users.forEach(u => {
        console.log(`  - ${u.email}`);
        console.log(`    Nombre: ${u.full_name}`);
        console.log(`    Rol: ${u.role}`);
        console.log(`    Activo: ${u.is_active}`);
        console.log(`    Creado: ${u.created_at.substring(0, 10)}\n`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

check();
