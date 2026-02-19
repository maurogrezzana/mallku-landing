import postgres from 'postgres';
import dotenv from 'dotenv';
import { excursiones } from '../../src/data/excursiones';
import { fechasSalidas } from '../../src/data/fechas';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

// Helper: Convertir precio string a centavos
function precioToCentavos(precioStr: string): number {
  // "$120.000" → 120000 → 12000000 (centavos)
  const numero = parseInt(precioStr.replace(/[$.]/g, ''));
  return numero * 100;
}

// Helper: Transformar itinerario al formato DB
function transformItinerario(itinerario: any[]) {
  return itinerario.map((item, index) => ({
    orden: index + 1,
    titulo: item.actividad,
    descripcion: item.descripcion,
  }));
}

// Helper: Actualizar fechas de 2024 a 2026
function actualizarFecha(fechaStr: string): string {
  // "2024-03-09" → "2026-03-09"
  return fechaStr.replace('2024', '2026');
}

// Helper: Convertir dificultad a formato DB
function parseDificultad(dificultadStr: string): 'baja' | 'media' | 'alta' {
  const lower = dificultadStr.toLowerCase();
  if (lower.includes('baja')) return 'baja';
  if (lower.includes('media')) return 'media';
  return 'alta';
}

// Helper: Parsear grupo max
function parseGrupoMax(grupoMaxStr: string): number {
  // "6-8 personas" → 8
  const match = grupoMaxStr.match(/(\d+)-?(\d+)?/);
  if (match) {
    return parseInt(match[2] || match[1]);
  }
  return 8;
}

async function migrate() {
  console.log('\n🚀 Iniciando migración de datos del sitio a DB\n');

  try {
    // ===================================
    // 1. LIMPIAR DATOS DE PRUEBA
    // ===================================
    console.log('🧹 Limpiando datos de prueba...');

    // Eliminar bookings de prueba
    await sql`DELETE FROM bookings WHERE booking_number LIKE 'MALLKU-TEST%' OR booking_number LIKE 'MALLKU-PROP-2026%' OR booking_number LIKE 'MALLKU-2026%'`;

    // Eliminar fechas de prueba
    await sql`DELETE FROM dates WHERE created_at >= '2026-02-17'`;

    // Eliminar excursiones de prueba
    await sql`DELETE FROM excursions`;

    console.log('✅ Datos de prueba eliminados\n');

    // ===================================
    // 2. MIGRAR EXCURSIONES
    // ===================================
    console.log('📦 Migrando excursiones del sitio...\n');

    const excursionesInsertadas = [];

    for (const exc of excursiones) {
      const [inserted] = await sql`
        INSERT INTO excursions (
          slug,
          titulo,
          subtitulo,
          descripcion,
          descripcion_larga,
          duracion,
          precio_base,
          grupo_max,
          dificultad,
          highlights,
          itinerario,
          incluye,
          no_incluye,
          recomendaciones,
          is_active,
          orden
        ) VALUES (
          ${exc.slug},
          ${exc.titulo},
          ${exc.subtitulo},
          ${exc.descripcion},
          ${exc.descripcionLarga},
          ${exc.duracion},
          ${precioToCentavos(exc.precio)},
          ${parseGrupoMax(exc.grupoMax)},
          ${parseDificultad(exc.dificultad)},
          ${exc.highlights},
          ${JSON.stringify(transformItinerario(exc.itinerario))},
          ${exc.incluye},
          ${exc.noIncluye},
          ${exc.recomendaciones},
          true,
          ${excursiones.indexOf(exc) + 1}
        )
        RETURNING id, slug, titulo
      `;

      excursionesInsertadas.push(inserted);
      console.log(`  ✅ ${inserted.titulo} (${inserted.slug})`);
    }

    console.log(`\n✅ ${excursionesInsertadas.length} excursiones migradas\n`);

    // ===================================
    // 3. MIGRAR FECHAS
    // ===================================
    console.log('📅 Migrando fechas del calendario...\n');

    // Crear mapa de slug → excursion_id
    const excursionMap = new Map(
      excursionesInsertadas.map(e => [e.slug, e.id])
    );

    const fechasInsertadas = [];

    for (const fecha of fechasSalidas) {
      const excursionId = excursionMap.get(fecha.excursionSlug);

      if (!excursionId) {
        console.warn(`  ⚠️  Excursión no encontrada: ${fecha.excursionSlug}`);
        continue;
      }

      // Calcular cupos reservados
      const cuposReservados = fecha.cuposTotales - fecha.cuposDisponibles;

      // Actualizar fecha a 2026
      const fechaActualizada = actualizarFecha(fecha.fecha);

      const [inserted] = await sql`
        INSERT INTO dates (
          excursion_id,
          fecha,
          hora_salida,
          cupos_totales,
          cupos_reservados,
          estado
        ) VALUES (
          ${excursionId},
          ${fechaActualizada}::timestamp,
          '08:00',
          ${fecha.cuposTotales},
          ${cuposReservados},
          ${fecha.estado}
        )
        RETURNING id, fecha::text, cupos_totales, cupos_reservados, estado
      `;

      fechasInsertadas.push(inserted);
      console.log(`  ✅ ${fechaActualizada} | ${inserted.cupos_reservados}/${inserted.cupos_totales} reservados | ${inserted.estado}`);
    }

    console.log(`\n✅ ${fechasInsertadas.length} fechas migradas\n`);

    // ===================================
    // 4. RESUMEN FINAL
    // ===================================
    console.log('📊 RESUMEN DE MIGRACIÓN:\n');

    const [statsExc] = await sql`SELECT COUNT(*) as total FROM excursions WHERE is_active = true`;
    const [statsDates] = await sql`SELECT COUNT(*) as total FROM dates`;
    const [statsBookings] = await sql`SELECT COUNT(*) as total FROM bookings`;

    console.log(`  🎯 Excursiones activas: ${statsExc.total}`);
    console.log(`  📅 Fechas en calendario: ${statsDates.total}`);
    console.log(`  📝 Reservas en sistema: ${statsBookings.total}`);

    console.log('\n✅ Migración completada exitosamente!\n');

  } catch (error) {
    console.error('❌ Error en la migración:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate();
