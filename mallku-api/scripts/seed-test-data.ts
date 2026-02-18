import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const sql = postgres(DATABASE_URL!, { max: 1 });

async function seedData() {
  try {
    console.log('🌱 Insertando datos de prueba...\n');

    // Insert excursions
    console.log('1. Insertando excursiones...');

    const [exc1] = await sql`
      INSERT INTO excursions (
        slug, titulo, subtitulo, descripcion, descripcion_larga,
        duracion, precio_base, grupo_max, dificultad,
        highlights, itinerario, incluye, no_incluye, recomendaciones,
        orden, is_active
      ) VALUES (
        'arqueologia-en-los-valles',
        'Arqueología en los Valles',
        'Quilmes, Tafí y los Menhires',
        'Recorrer mil años de historia andina en un día: desde los monolitos sagrados de la cultura Tafí hasta la ciudad fortificada de Quilmes, último bastión de la resistencia calchaquí.',
        ${sql.json([
          'Esta excursión te lleva a través de más de mil años de historia andina en un solo día. Comenzamos en el Valle de Tafí, donde la cultura Tafí dejó su huella en forma de misteriosos menhires de piedra, monolitos que aún guardan secretos sobre sus rituales y cosmovisión.',
          'Cruzamos el Abra del Infiernillo a más de 3.000 metros de altura, un paso de montaña que conecta dos mundos: las yungas húmedas y los valles secos calchaquíes. El paisaje cambia dramáticamente mientras descendemos hacia Quilmes.',
          'Quilmes fue la ciudad más grande del noroeste argentino prehispánico. Sus habitantes resistieron más de 130 años a la conquista española, siendo el último bastión de la resistencia calchaquí. Caminar entre sus terrazas es caminar por la historia viva de un pueblo que nunca se rindió.'
        ])},
        '12 horas',
        12000000,
        8,
        'media',
        ${sql.json([
          'Parque de los Menhires (cultura Tafí, 300 AC - 800 DC)',
          'Valle de Tafí y su esplendor paisajístico',
          'Abra del Infiernillo (3.042 msnm)',
          'Ciudad Sagrada de Quilmes (último bastión calchaquí)',
          'Almuerzo típico regional incluido'
        ])},
        ${sql.json([
          { orden: 1, titulo: 'Salida desde Tucumán', descripcion: 'Partimos desde punto de encuentro acordado en San Miguel de Tucumán' },
          { orden: 2, titulo: 'Parque de los Menhires', descripcion: 'Visita guiada al sitio arqueológico con interpretación de la cultura Tafí' },
          { orden: 3, titulo: 'Valle de Tafí', descripcion: 'Recorrido panorámico, parada en miradores y contexto histórico del valle' },
          { orden: 4, titulo: 'Abra del Infiernillo', descripcion: 'Cruce del paso de montaña a 3.042 msnm con parada para fotos' },
          { orden: 5, titulo: 'Almuerzo', descripcion: 'Almuerzo típico regional en restaurante local (incluido)' },
          { orden: 6, titulo: 'Ciudad Sagrada de Quilmes', descripcion: 'Visita completa al sitio arqueológico con interpretación histórica profunda' },
          { orden: 7, titulo: 'Regreso', descripcion: 'Retorno a Tucumán con paradas opcionales' },
          { orden: 8, titulo: 'Llegada', descripcion: 'Llegada estimada a San Miguel de Tucumán' }
        ])},
        ${sql.json([
          'Transporte en vehículo cómodo con aire acondicionado',
          'Guía arqueólogo especializado durante toda la excursión',
          'Entrada al Parque de los Menhires',
          'Entrada a la Ciudad Sagrada de Quilmes',
          'Almuerzo completo con bebida',
          'Seguro de responsabilidad civil',
          'Agua mineral durante el recorrido'
        ])},
        ${sql.json([
          'Propinas (opcionales)',
          'Gastos personales',
          'Comidas adicionales no mencionadas'
        ])},
        ${sql.json([
          'Llevar ropa cómoda y en capas (variación de temperatura por altura)',
          'Calzado cerrado cómodo para caminar',
          'Protector solar y sombrero',
          'Agua extra personal',
          'Cámara de fotos',
          'Efectivo para compras artesanales (opcional)'
        ])},
        1,
        true
      )
      ON CONFLICT (slug) DO UPDATE SET updated_at = now()
      RETURNING *;
    `;

    const [exc2] = await sql`
      INSERT INTO excursions (
        slug, titulo, subtitulo, descripcion, descripcion_larga,
        duracion, precio_base, grupo_max, dificultad,
        highlights, itinerario, incluye, no_incluye, recomendaciones,
        orden, is_active
      ) VALUES (
        'tucuman-colonial',
        'Tucumán Colonial',
        'Ibatín, Yungas y Estancias Jesuitas',
        'Entender cómo nació Tucumán: desde su primera fundación en plena selva hasta el sistema de estancias jesuitas que moldeó el valle.',
        ${sql.json([
          'Esta excursión te lleva a los orígenes de Tucumán, a entender las decisiones, fracasos y adaptaciones que dieron forma a la provincia. Comenzamos visitando las ruinas de Ibatín, donde San Miguel de Tucumán fue fundado por primera vez en 1565.',
          'Ibatín fue abandonada en 1685 después de 120 años de existencia. Las razones fueron múltiples: ataques de pueblos originarios, inundaciones, plagas. La ciudad se trasladó a su ubicación actual, dejando atrás los restos de la primera fundación en medio de la selva.',
          'Atravesamos la Quebrada del Río Los Sosa, uno de los paisajes más impresionantes de las yungas tucumanas, antes de llegar al Valle de Tafí y conocer el legado jesuita que transformó la región con su sistema de estancias productivas.'
        ])},
        '10 horas',
        10000000,
        8,
        'baja',
        ${sql.json([
          'Ruinas de Ibatín - Primera Fundación (1565-1685)',
          'Quebrada del Río Los Sosa (yungas tucumanas)',
          'Valle de Tafí del Valle',
          'Museo Jesuítico de La Banda',
          'Capilla histórica de La Banda'
        ])},
        ${sql.json([
          { orden: 1, titulo: 'Salida desde Tucumán', descripcion: 'Partimos hacia el sur de la provincia' },
          { orden: 2, titulo: 'Ruinas de Ibatín', descripcion: 'Visita al sitio de la primera fundación con contexto histórico completo' },
          { orden: 3, titulo: 'Quebrada del Río Los Sosa', descripcion: 'Recorrido por la selva de yungas con paradas panorámicas' },
          { orden: 4, titulo: 'Almuerzo en Tafí', descripcion: 'Almuerzo en el valle (incluido)' },
          { orden: 5, titulo: 'Museo Jesuítico La Banda', descripcion: 'Visita al museo y capilla con historia de las estancias jesuitas' },
          { orden: 6, titulo: 'Recorrido por el valle', descripcion: 'Paseo por Tafí del Valle con tiempo libre' },
          { orden: 7, titulo: 'Regreso', descripcion: 'Retorno a Tucumán' },
          { orden: 8, titulo: 'Llegada', descripcion: 'Llegada estimada a San Miguel de Tucumán' }
        ])},
        ${sql.json([
          'Transporte en vehículo cómodo con aire acondicionado',
          'Guía especializado en historia colonial',
          'Entrada al sitio de Ibatín',
          'Entrada al Museo Jesuítico',
          'Almuerzo completo con bebida',
          'Seguro de responsabilidad civil'
        ])},
        ${sql.json([
          'Propinas (opcionales)',
          'Gastos personales',
          'Comidas adicionales no mencionadas'
        ])},
        ${sql.json([
          'Llevar ropa cómoda',
          'Calzado cerrado (hay tramos de tierra)',
          'Protector solar',
          'Repelente de insectos (zona de yungas)',
          'Cámara de fotos'
        ])},
        2,
        true
      )
      ON CONFLICT (slug) DO UPDATE SET updated_at = now()
      RETURNING *;
    `;

    console.log(`   ✅ Insertadas: ${exc1.titulo}, ${exc2.titulo}\n`);

    // Insert some test dates
    console.log('2. Insertando fechas de prueba...');

    // Dates for next 2 months
    const today = new Date();
    const dates = [];

    // Arqueología en los Valles - 4 fechas
    for (let i = 0; i < 4; i++) {
      const fecha = new Date(today);
      fecha.setDate(fecha.getDate() + (i * 7) + 5); // Every week, starting in 5 days

      const [date] = await sql`
        INSERT INTO dates (
          excursion_id, fecha, hora_salida, cupos_totales, cupos_reservados, estado
        ) VALUES (
          ${exc1.id},
          ${fecha.toISOString()},
          '08:00',
          8,
          ${i === 1 ? 6 : i === 2 ? 8 : 0},
          ${i === 1 ? 'pocos-cupos' : i === 2 ? 'completo' : 'disponible'}
        )
        RETURNING *;
      `;
      dates.push(date);
    }

    // Tucumán Colonial - 3 fechas
    for (let i = 0; i < 3; i++) {
      const fecha = new Date(today);
      fecha.setDate(fecha.getDate() + (i * 10) + 8); // Every 10 days, starting in 8 days

      const [date] = await sql`
        INSERT INTO dates (
          excursion_id, fecha, hora_salida, cupos_totales, cupos_reservados, estado
        ) VALUES (
          ${exc2.id},
          ${fecha.toISOString()},
          '08:00',
          8,
          0,
          'disponible'
        )
        RETURNING *;
      `;
      dates.push(date);
    }

    console.log(`   ✅ Insertadas ${dates.length} fechas\n`);

    console.log('📊 Resumen de datos creados:');
    console.log(`   - Excursiones: 2`);
    console.log(`   - Fechas: ${dates.length} (próximos 2 meses)`);
    console.log(`   - Estados: disponible, pocos-cupos, completo`);
    console.log('');
    console.log('🎉 ¡Datos de prueba insertados correctamente!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedData();
