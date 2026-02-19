import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

async function addMissingColumns() {
  try {
    console.log('🔄 Agregando columnas y enums faltantes...\n');

    // Create missing ENUMs
    console.log('1. Creando ENUMs faltantes...');
    await sql.unsafe(`
      DO $$ BEGIN
        CREATE TYPE "public"."booking_tipo" AS ENUM('fecha-fija', 'personalizada');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await sql.unsafe(`
      DO $$ BEGIN
        CREATE TYPE "public"."propuesta_estado" AS ENUM('pendiente', 'aprobada', 'rechazada');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('   ✅ ENUMs creados\n');

    // Add missing columns to bookings table
    console.log('2. Agregando columnas faltantes a tabla bookings...');

    // Add tipo column
    await sql.unsafe(`
      DO $$ BEGIN
        ALTER TABLE bookings ADD COLUMN tipo "booking_tipo";
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // Add excursion_id column
    await sql.unsafe(`
      DO $$ BEGIN
        ALTER TABLE bookings ADD COLUMN excursion_id uuid;
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // Add fecha_propuesta column
    await sql.unsafe(`
      DO $$ BEGIN
        ALTER TABLE bookings ADD COLUMN fecha_propuesta timestamp;
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // Add estado_propuesta column
    await sql.unsafe(`
      DO $$ BEGIN
        ALTER TABLE bookings ADD COLUMN estado_propuesta "propuesta_estado";
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);

    // Add motivo_rechazo column
    await sql.unsafe(`
      DO $$ BEGIN
        ALTER TABLE bookings ADD COLUMN motivo_rechazo text;
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `);
    console.log('   ✅ Columnas agregadas\n');

    // Make date_id nullable (it was NOT NULL before, but should be nullable for personalizada)
    console.log('3. Ajustando columnas existentes...');
    await sql.unsafe(`ALTER TABLE bookings ALTER COLUMN date_id DROP NOT NULL;`);
    await sql.unsafe(`ALTER TABLE bookings ALTER COLUMN precio_total DROP NOT NULL;`);
    console.log('   ✅ Columnas ajustadas\n');

    // Add foreign key for excursion_id if it doesn't exist
    console.log('4. Agregando foreign keys...');
    await sql.unsafe(`
      DO $$ BEGIN
        ALTER TABLE bookings ADD CONSTRAINT bookings_excursion_id_excursions_id_fk
          FOREIGN KEY (excursion_id) REFERENCES excursions(id);
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('   ✅ Foreign keys agregadas\n');

    console.log('🎉 ¡Migración completada exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

addMissingColumns();
