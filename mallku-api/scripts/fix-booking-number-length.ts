import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

async function fix() {
  try {
    console.log('🔧 Ampliando el campo booking_number...\n');

    await sql.unsafe(`
      ALTER TABLE bookings
      ALTER COLUMN booking_number TYPE varchar(30);
    `);

    console.log('✅ Campo booking_number ampliado a 30 caracteres');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

fix();
