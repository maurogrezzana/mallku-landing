import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

async function runMigration() {
  const sql = postgres(DATABASE_URL, { max: 1 });

  try {
    console.log('🔄 Running migration...');

    // Read migration file
    const migrationSQL = readFileSync(
      join(__dirname, '../src/db/migrations/0001_add_calendar_system.sql'),
      'utf-8'
    );

    // Execute migration
    await sql.unsafe(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Created tables:');
    console.log('  - excursions');
    console.log('  - dates');
    console.log('  - bookings');
    console.log('');
    console.log('Created enums:');
    console.log('  - booking_tipo');
    console.log('  - propuesta_estado');
    console.log('  - date_status');
    console.log('  - booking_status');
    console.log('  - payment_status');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
