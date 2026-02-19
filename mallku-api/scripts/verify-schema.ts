import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

async function verifySchema() {
  try {
    console.log('🔍 Verificando schema de la base de datos...\n');

    // Check ENUMs
    const enums = await sql`
      SELECT t.typname as enum_name, array_agg(e.enumlabel) as values
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname IN ('booking_tipo', 'propuesta_estado', 'date_status', 'booking_status', 'payment_status')
      GROUP BY t.typname
      ORDER BY t.typname;
    `;

    console.log('✅ ENUMs creados:');
    enums.forEach((e) => {
      console.log(`   - ${e.enum_name}: ${e.values.join(', ')}`);
    });
    console.log('');

    // Check Tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('excursions', 'dates', 'bookings', 'leads', 'users', 'events', 'newsletter_subscribers')
      ORDER BY table_name;
    `;

    console.log('✅ Tablas en la DB:');
    tables.forEach((t) => {
      console.log(`   - ${t.table_name}`);
    });
    console.log('');

    // Check columns in bookings table
    const bookingCols = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'bookings'
      ORDER BY ordinal_position;
    `;

    console.log('✅ Columnas en tabla bookings:');
    bookingCols.forEach((c) => {
      console.log(`   - ${c.column_name} (${c.data_type}) ${c.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    console.log('');

    // Count rows
    const counts = await sql`
      SELECT
        (SELECT COUNT(*) FROM excursions) as excursions,
        (SELECT COUNT(*) FROM dates) as dates,
        (SELECT COUNT(*) FROM bookings) as bookings,
        (SELECT COUNT(*) FROM leads) as leads;
    `;

    console.log('📊 Cantidad de registros:');
    console.log(`   - Excursions: ${counts[0].excursions}`);
    console.log(`   - Dates: ${counts[0].dates}`);
    console.log(`   - Bookings: ${counts[0].bookings}`);
    console.log(`   - Leads: ${counts[0].leads}`);
    console.log('');

    console.log('🎉 Schema verificado correctamente!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

verifySchema();
