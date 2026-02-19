import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

// Nueva contraseña - cambiala aquí
const NUEVA_PASSWORD = 'mallku2026';

async function reset() {
  try {
    const hash = await bcrypt.hash(NUEVA_PASSWORD, 10);

    const [user] = await sql`
      UPDATE users
      SET password_hash = ${hash}, updated_at = NOW()
      WHERE role = 'admin'
      RETURNING email, full_name
    `;

    console.log('\n✅ Contraseña reseteada exitosamente\n');
    console.log(`   Email:      ${user.email}`);
    console.log(`   Nombre:     ${user.full_name}`);
    console.log(`   Contraseña: ${NUEVA_PASSWORD}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

reset();
