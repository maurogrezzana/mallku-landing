import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

async function verify() {
  try {
    console.log('\n🔍 Verificando datos migrados...\n');

    // Ver excursiones
    const excursiones = await sql`
      SELECT
        titulo,
        slug,
        duracion,
        precio_base,
        grupo_max,
        dificultad,
        orden,
        is_active
      FROM excursions
      ORDER BY orden
    `;

    console.log('📦 EXCURSIONES MIGRADAS:\n');
    excursiones.forEach(e => {
      console.log(`  ${e.orden}. ${e.titulo}`);
      console.log(`     Slug: ${e.slug}`);
      console.log(`     Precio: $${(e.precio_base / 100).toLocaleString('es-AR')}`);
      console.log(`     Duración: ${e.duracion} | Grupo: ${e.grupo_max} pax | Dificultad: ${e.dificultad}`);
      console.log(`     Activa: ${e.is_active}\n`);
    });

    // Ver fechas agrupadas por excursión
    const fechas = await sql`
      SELECT
        e.titulo as excursion,
        d.fecha::text,
        d.cupos_totales,
        d.cupos_reservados,
        (d.cupos_totales - d.cupos_reservados) as cupos_disponibles,
        d.estado
      FROM dates d
      JOIN excursions e ON d.excursion_id = e.id
      ORDER BY e.orden, d.fecha
    `;

    console.log('📅 FECHAS MIGRADAS POR EXCURSIÓN:\n');

    let excursionActual = '';
    fechas.forEach(f => {
      if (f.excursion !== excursionActual) {
        excursionActual = f.excursion;
        console.log(`\n  📌 ${excursionActual}:`);
      }
      const fecha = f.fecha.substring(0, 10);
      console.log(`     ${fecha} | ${f.cupos_reservados}/${f.cupos_totales} reservados | ${f.cupos_disponibles} disponibles | ${f.estado}`);
    });

    // Resumen por mes
    console.log('\n\n📊 RESUMEN POR MES:\n');

    const porMes = await sql`
      SELECT
        TO_CHAR(fecha, 'YYYY-MM') as mes,
        COUNT(*) as total_fechas,
        SUM(CASE WHEN estado = 'disponible' THEN 1 ELSE 0 END) as disponibles,
        SUM(CASE WHEN estado = 'pocos-cupos' THEN 1 ELSE 0 END) as pocos_cupos,
        SUM(CASE WHEN estado = 'completo' THEN 1 ELSE 0 END) as completos
      FROM dates
      GROUP BY mes
      ORDER BY mes
    `;

    porMes.forEach(m => {
      console.log(`  ${m.mes}: ${m.total_fechas} fechas (${m.disponibles} disponibles, ${m.pocos_cupos} pocos cupos, ${m.completos} completos)`);
    });

    console.log('\n✅ Verificación completa\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sql.end();
  }
}

verify();
