import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

async function check() {
  try {
    console.log('\n📊 Estado de las fechas y reservas:\n');

    // Ver todas las fechas con sus cupos
    const dates = await sql`
      SELECT
        d.id,
        d.fecha::text,
        e.titulo as excursion,
        d.cupos_totales,
        d.cupos_reservados,
        d.estado,
        (d.cupos_totales - d.cupos_reservados) as cupos_disponibles
      FROM dates d
      JOIN excursions e ON d.excursion_id = e.id
      ORDER BY d.fecha
    `;

    console.log('Fechas disponibles:');
    dates.forEach(d => {
      console.log(`  - ${d.fecha.substring(0, 10)} | ${d.excursion.substring(0, 30)}`);
      console.log(`    Cupos: ${d.cupos_reservados}/${d.cupos_totales} reservados | ${d.cupos_disponibles} disponibles | Estado: ${d.estado}`);
    });

    // Ver todas las reservas
    const bookings = await sql`
      SELECT
        b.booking_number,
        b.tipo,
        b.nombre_completo,
        b.cantidad_personas,
        b.status,
        b.estado_propuesta,
        b.fecha_propuesta::text,
        COALESCE(d.fecha::text, 'N/A') as fecha_reservada,
        COALESCE(e.titulo, e2.titulo) as excursion
      FROM bookings b
      LEFT JOIN dates d ON b.date_id = d.id
      LEFT JOIN excursions e ON d.excursion_id = e.id
      LEFT JOIN excursions e2 ON b.excursion_id = e2.id
      ORDER BY b.created_at DESC
    `;

    console.log('\n\nReservas creadas:');
    bookings.forEach(b => {
      console.log(`\n  ${b.booking_number} (${b.tipo})`);
      console.log(`    Cliente: ${b.nombre_completo} | ${b.cantidad_personas} personas`);
      console.log(`    Excursión: ${b.excursion}`);
      if (b.tipo === 'fecha-fija') {
        console.log(`    Fecha: ${b.fecha_reservada?.substring(0, 10)} | Status: ${b.status}`);
      } else {
        console.log(`    Fecha propuesta: ${b.fecha_propuesta?.substring(0, 10)}`);
        console.log(`    Estado propuesta: ${b.estado_propuesta} | Status: ${b.status}`);
      }
    });

    console.log('\n✅ Verificación completa\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

check();
