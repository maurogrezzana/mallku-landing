/**
 * seed.ts — Migración de datos hardcodeados a la base de datos
 *
 * Inserta las 3 excursiones y las 13 fechas de salida originales.
 * Idempotente: si los datos ya existen, actualiza sin duplicar.
 *
 * Uso:
 *   cd mallku-api
 *   npx tsx scripts/seed.ts
 */

import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { excursions, dates } from '../src/db/schema.js';

// ==========================================
// SETUP
// ==========================================

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no está definido en .env');
  process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

// Helper: parsea precio string ARS a centavos
// '$120.000' → 12_000_000 centavos (= 120.000 pesos × 100)
function parsePrecio(precio: string): number {
  const cleaned = precio.replace(/[$.\s]/g, '');
  return parseInt(cleaned, 10) * 100;
}

// ==========================================
// DATOS: EXCURSIONES
// ==========================================

const excursionesData = [
  {
    slug: 'arqueologia-en-los-valles',
    titulo: 'Arqueología en los Valles',
    subtitulo: 'Quilmes, Tafí y los Menhires',
    descripcion:
      'Recorrer mil años de historia andina en un día: desde los monolitos sagrados de la cultura Tafí hasta la ciudad fortificada de Quilmes, último bastión de la resistencia calchaquí.',
    descripcionLarga: [
      'Esta excursión te lleva a través de más de mil años de historia andina en un solo día. Comenzamos en el Valle de Tafí, donde la cultura Tafí dejó su huella en forma de misteriosos menhires de piedra, monolitos que aún guardan secretos sobre sus rituales y cosmovisión.',
      'Cruzamos el Abra del Infiernillo a más de 3.000 metros de altura, un paso de montaña que conecta dos mundos: las yungas húmedas y los valles secos calchaquíes. El paisaje cambia dramáticamente mientras descendemos hacia Quilmes.',
      'Quilmes fue la ciudad más grande del noroeste argentino prehispánico. Sus habitantes resistieron más de 130 años a la conquista española, siendo el último bastión de la resistencia calchaquí. Caminar entre sus terrazas es caminar por la historia viva de un pueblo que nunca se rindió.',
    ],
    duracion: '12 horas',
    precioBase: parsePrecio('$120.000'),
    grupoMax: 8,
    dificultad: 'Media (caminatas cortas en altura)',
    highlights: [
      'Parque de los Menhires (cultura Tafí, 300 AC - 800 DC)',
      'Valle de Tafí y su esplendor paisajístico',
      'Abra del Infiernillo (3.042 msnm)',
      'Ciudad Sagrada de Quilmes (último bastión calchaquí)',
      'Almuerzo típico regional incluido',
    ],
    itinerario: [
      { orden: 1, titulo: '08:00 — Salida desde Tucumán', descripcion: 'La ciudad todavía duerme cuando partimos. La ruta trepa hacia el oeste mientras el sol empieza a calentar los cerros verdes del pedemonte tucumano.' },
      { orden: 2, titulo: '09:30 — Parque de los Menhires', descripcion: 'Más de cien monolitos de piedra tallados hace dos mil años nos reciben en silencio. Recorremos el parque descifrando rostros, símbolos y las teorías que intentan explicar su significado.' },
      { orden: 3, titulo: '11:00 — Valle de Tafí', descripcion: 'El valle se abre como un anfiteatro natural rodeado de cumbres. Paramos en miradores donde se siente el peso de la historia: este paisaje fue escenario de culturas que aquí vivieron durante milenios.' },
      { orden: 4, titulo: '12:30 — Abra del Infiernillo', descripcion: 'A 3.042 metros, el aire se vuelve fino y el paisaje cambia radicalmente. Dejamos atrás las yungas verdes y entramos en el mundo seco y luminoso de los Valles Calchaquíes. La vista es infinita.' },
      { orden: 5, titulo: '13:30 — Almuerzo', descripcion: 'Nos sentamos a comer en el valle. Sabores regionales, ritmo pausado, tiempo para conversar sobre lo que vimos y lo que viene. Todo incluido.' },
      { orden: 6, titulo: '15:00 — Ciudad Sagrada de Quilmes', descripcion: 'El momento más intenso del día. Caminamos entre las terrazas de la ciudad que resistió 130 años a la conquista española. Cada muro cuenta una historia de organización, resistencia y tragedia.' },
      { orden: 7, titulo: '17:30 — Regreso', descripcion: 'Emprendemos el regreso con la luz dorada de la tarde sobre los valles. Hay tiempo para paradas, preguntas y el silencio de procesar todo lo vivido.' },
      { orden: 8, titulo: '20:00 — Llegada', descripcion: 'Llegamos a Tucumán con mil años de historia encima. No es lo mismo la ciudad después de haber caminado Quilmes.' },
    ],
    incluye: [
      'Transporte en vehículo cómodo con aire acondicionado',
      'Guía arqueólogo especializado durante toda la excursión',
      'Entrada al Parque de los Menhires',
      'Entrada a la Ciudad Sagrada de Quilmes',
      'Almuerzo completo con bebida',
      'Seguro de responsabilidad civil',
      'Agua mineral durante el recorrido',
    ],
    noIncluye: [
      'Propinas (opcionales)',
      'Gastos personales',
      'Comidas adicionales no mencionadas',
    ],
    recomendaciones: [
      'Llevar ropa cómoda y en capas (variación de temperatura por altura)',
      'Calzado cerrado cómodo para caminar',
      'Protector solar y sombrero',
      'Agua extra personal',
      'Cámara de fotos',
      'Efectivo para compras artesanales (opcional)',
    ],
    imagenPrincipal: '/images/Quilmes 1.jpg',
    galeria: [
      '/images/Quilmes 1.jpg',
      '/images/Quilmes 2.jpg',
      '/images/quilmes 3.jpg',
      '/images/quilmes 4.jpg',
      '/images/quilmes 5.jpg',
      '/images/Quilmes 6.jpg',
      '/images/Quilmes 7.jpg',
      '/images/menhires 1.jpg',
      '/images/menhires 2.jpg',
      '/images/menhires 3.jpg',
      '/images/Menhires 4.jpg',
      '/images/Tafi del Valle.jpg',
      '/images/Infiernillo.jpg',
    ],
    isActive: true,
    orden: 1,
  },
  {
    slug: 'tucuman-colonial',
    titulo: 'Tucumán Colonial',
    subtitulo: 'Ibatín, Yungas y Estancias Jesuitas',
    descripcion:
      'Entender cómo nació Tucumán: desde su primera fundación en plena selva hasta el sistema de estancias jesuitas que moldeó el valle.',
    descripcionLarga: [
      'Esta excursión te lleva a los orígenes de Tucumán, a entender las decisiones, fracasos y adaptaciones que dieron forma a la provincia. Comenzamos visitando las ruinas de Ibatín, donde San Miguel de Tucumán fue fundado por primera vez en 1565.',
      'Ibatín fue abandonada en 1685 después de 120 años de existencia. Las razones fueron múltiples: ataques de pueblos originarios, inundaciones, plagas. La ciudad se trasladó a su ubicación actual, dejando atrás los restos de la primera fundación en medio de la selva.',
      'Atravesamos la Quebrada del Río Los Sosa, uno de los paisajes más impresionantes de las yungas tucumanas, antes de llegar al Valle de Tafí y conocer el legado jesuita que transformó la región con su sistema de estancias productivas.',
    ],
    duracion: '10 horas',
    precioBase: parsePrecio('$100.000'),
    grupoMax: 8,
    dificultad: 'Baja (apto para todas las edades)',
    highlights: [
      'Ruinas de Ibatín - Primera Fundación (1565-1685)',
      'Quebrada del Río Los Sosa (yungas tucumanas)',
      'Valle de Tafí del Valle',
      'Museo Jesuítico de La Banda',
      'Capilla histórica de La Banda',
    ],
    itinerario: [
      { orden: 1, titulo: '08:00 — Salida desde Tucumán', descripcion: 'Dejamos la ciudad hacia el sur, rumbo al lugar donde todo empezó. La ruta atraviesa cañaverales y el paisaje se vuelve cada vez más verde y selvático.' },
      { orden: 2, titulo: '09:30 — Ruinas de Ibatín', descripcion: 'Entramos en la selva donde hace 460 años se fundó Tucumán por primera vez. Entre la vegetación aparecen los cimientos de lo que fue una ciudad colonial completa: iglesia, cabildo, plaza. Contamos por qué fracasó y qué nos enseña.' },
      { orden: 3, titulo: '11:30 — Quebrada del Río Los Sosa', descripcion: 'La ruta se interna en una de las quebradas más espectaculares de las yungas. Helechos gigantes, cascadas, el río corriendo junto al camino. Paramos en miradores donde la selva se abre y deja ver la montaña.' },
      { orden: 4, titulo: '13:00 — Almuerzo en Tafí', descripcion: 'Llegamos al Valle de Tafí con hambre y con paisaje de fondo. Almorzamos con calma, rodeados de montañas y aire limpio de altura. Todo incluido.' },
      { orden: 5, titulo: '14:30 — Museo Jesuítico La Banda', descripcion: 'La capilla de La Banda guarda siglos de historia jesuita. Recorremos el museo donde se cuenta cómo los jesuitas transformaron el valle con su sistema de estancias y misiones.' },
      { orden: 6, titulo: '16:00 — Recorrido por el valle', descripcion: 'Tiempo para caminar por Tafí del Valle, sentir la brisa de la tarde y recorrer un pueblo que vive entre cerros y tradición. Ritmo libre, sin apuro.' },
      { orden: 7, titulo: '17:00 — Regreso', descripcion: 'Volvemos por la quebrada con la luz cambiando sobre la selva. El regreso también es parte de la experiencia.' },
      { orden: 8, titulo: '18:00 — Llegada', descripcion: 'De vuelta en Tucumán con otra mirada. La ciudad que hoy conocés nació de un fracaso colonial que visitaste esta mañana.' },
    ],
    incluye: [
      'Transporte en vehículo cómodo con aire acondicionado',
      'Guía especializado en historia colonial',
      'Entrada al sitio de Ibatín',
      'Entrada al Museo Jesuítico',
      'Almuerzo completo con bebida',
      'Seguro de responsabilidad civil',
    ],
    noIncluye: [
      'Propinas (opcionales)',
      'Gastos personales',
      'Comidas adicionales no mencionadas',
    ],
    recomendaciones: [
      'Llevar ropa cómoda',
      'Calzado cerrado (hay tramos de tierra)',
      'Protector solar',
      'Repelente de insectos (zona de yungas)',
      'Cámara de fotos',
    ],
    imagenPrincipal: '/images/Ibatin 1.jpg',
    galeria: [
      '/images/Ibatin 1.jpg',
      '/images/ibatin 2.jpg',
      '/images/Ibatin 3.jpg',
      '/images/Ibatin 4.jpg',
      '/images/Ibatin 5.jpg',
      '/images/Museo jesuita 1.jpg',
      '/images/museo jesuita 2.jpg',
      '/images/museo jesuita 3.jpg',
      '/images/reduccion lules 1.jpg',
      '/images/reduccion lules 2.jpg',
      '/images/reduccion lules 3.jpg',
      '/images/reduccion lules 4.jpg',
    ],
    isActive: true,
    orden: 2,
  },
  {
    slug: 'mallku-experience-4x4',
    titulo: 'Mallku Experience 4x4',
    subtitulo: '4 días explorando la Puna catamarqueña',
    descripcion:
      'Una aventura de 4 días por los paisajes más extremos y remotos del NOA: el Campo de Piedra Pómez, el Volcán Galán con la caldera más grande del mundo, sitios arqueológicos milenarios y las Ruinas de Shincal.',
    descripcionLarga: [
      'Mallku Experience 4x4 es nuestra expedición más ambiciosa: cuatro días recorriendo la Puna catamarqueña en vehículos 4x4, acompañados por guías baqueanos locales que conocen cada rincón de este territorio extremo.',
      'Desde formaciones geológicas únicas en el planeta como el Campo de Piedra Pómez, hasta la caldera volcánica más grande del mundo en el Volcán Galán. Desde sitios arqueológicos de 10.000 años de antigüedad hasta la capital austral del Imperio Inca en Shincal.',
      'Esta no es una excursión convencional. Es una inmersión profunda en uno de los paisajes más remotos y sobrecogedores de Argentina, donde el altiplano, los volcanes, las lagunas de altura y la historia ancestral se encuentran.',
    ],
    duracion: '4 días / 3 noches',
    precioBase: parsePrecio('$1.525.000'),
    grupoMax: 6,
    dificultad: 'Media-Alta (altura y caminos de ripio)',
    highlights: [
      'Campo de Piedra Pómez (formación geológica única en el mundo)',
      'Volcán Galán (caldera más grande del mundo)',
      'Pucará de Alumbrera (sitio arqueológico 10.000 años)',
      'El Shincal de Quimivil (capital inca del sur)',
      'Alojamiento en Antofagasta de la Sierra incluido',
      'Guías baqueanos locales especializados',
    ],
    itinerario: [
      {
        orden: 1,
        titulo: 'Día 1 — Campo de Piedra Pómez',
        descripcion: '07:30 a 17:00 · Quebrada de Belén · Puerto Viejo · Duna de Randolfo · Reserva de la Biosfera de Laguna Blanca · Mirador Pasto Ventura · Campo de Olas · Campo de Piedra Pómez · Noche en Antofagasta de la Sierra',
      },
      {
        orden: 2,
        titulo: 'Día 2 — Sitios Arqueológicos',
        descripcion: '08:30 a 16:00 · Pucará de Alumbrera · Confluencia · Peñas Coloradas · Volcán Antofagasta (trekking opcional) · Noche en Antofagasta de la Sierra',
      },
      {
        orden: 3,
        titulo: 'Día 3 — Volcán Galán',
        descripcion: '07:30 a 17:00 · Campo de Las Tobas · Cañón de Mirihuaca · Real Grande · Ojos de Pirica · Mirador Borde Oeste Volcán Galán · Laguna Diamante · Géiseres · Laguna Grande · Cena de despedida (parrillada incluida)',
      },
      {
        orden: 4,
        titulo: 'Día 4 — El Shincal de Quimivil',
        descripcion: 'Regreso a Belén · Visita a El Shincal de Quimivil (capital inca del sur)',
      },
    ],
    incluye: [
      'Transporte en vehículo 4x4 durante los 4 días',
      'Alojamiento en Antofagasta de la Sierra (3 noches)',
      'Guía baqueano local especializado',
      'Todas las excursiones detalladas en el itinerario',
      'Entradas a sitios arqueológicos',
      'Cena de despedida (Día 3)',
      'Seguro de responsabilidad civil',
    ],
    noIncluye: [
      'Comidas (almuerzo y cena, excepto cena día 3)',
      'Propinas (opcionales)',
      'Gastos personales',
    ],
    recomendaciones: [
      'Hidratación: llevar al menos 2 litros de agua por jornada',
      'Vestimenta técnica en capas (amplitud térmica >30°C)',
      'Cortaviento o campera resistente al viento',
      'Protector solar de alto factor y sombrero',
      'Lentes de sol con filtro UV certificado',
      'Calzado cerrado con buena suela',
      'Consultar con un médico sobre mal de altura (apunamiento)',
      'Batería y memoria extra para cámaras y teléfonos',
    ],
    imagenPrincipal: '/images/4x4.png',
    galeria: [
      '/images/4x4.png',
      '/images/4x4 2.png',
      '/images/4x4 3.png',
      '/images/4x4 4.png',
      '/images/4x4 5.jpg',
      '/images/Campo Piedra Pomez.jpg',
      '/images/Campo Piedra Pomez 2.jpg',
      '/images/Volcan Galan 1.webp',
      '/images/Volcan Galan 2.webp',
      '/images/real grande.jpg',
      '/images/Shincal 1.jpg',
      '/images/Shincal 2.jpg',
      '/images/ANS 6.jpg',
      '/images/ANS 7.jpg',
      '/images/ANS 12.jpg',
    ],
    isActive: true,
    orden: 3,
  },
];

// ==========================================
// DATOS: FECHAS DE SALIDA
// ==========================================
// cuposReservados = cuposTotales - cuposDisponibles (desde fechas.ts)
// precioOverride = null (usamos precioBase de la excursión)

const fechasData = [
  // Febrero 2026
  { slug: 'arqueologia-en-los-valles', fecha: '2026-02-14', cuposTotales: 8, cuposReservados: 4, estado: 'disponible' as const, horaSalida: '08:00' },
  { slug: 'tucuman-colonial',          fecha: '2026-02-21', cuposTotales: 8, cuposReservados: 2, estado: 'disponible' as const, horaSalida: '08:00' },
  { slug: 'arqueologia-en-los-valles', fecha: '2026-02-28', cuposTotales: 8, cuposReservados: 6, estado: 'pocos-cupos' as const, horaSalida: '08:00' },

  // Marzo 2026
  { slug: 'tucuman-colonial',          fecha: '2026-03-07', cuposTotales: 8, cuposReservados: 0, estado: 'disponible' as const, horaSalida: '08:00' },
  { slug: 'arqueologia-en-los-valles', fecha: '2026-03-14', cuposTotales: 8, cuposReservados: 2, estado: 'disponible' as const, horaSalida: '08:00' },
  { slug: 'mallku-experience-4x4',     fecha: '2026-03-19', cuposTotales: 6, cuposReservados: 2, estado: 'disponible' as const, horaSalida: '07:30' },
  { slug: 'tucuman-colonial',          fecha: '2026-03-21', cuposTotales: 8, cuposReservados: 5, estado: 'pocos-cupos' as const, horaSalida: '08:00' },
  { slug: 'arqueologia-en-los-valles', fecha: '2026-03-28', cuposTotales: 8, cuposReservados: 0, estado: 'disponible' as const, horaSalida: '08:00' },

  // Abril 2026
  { slug: 'tucuman-colonial',          fecha: '2026-04-04', cuposTotales: 8, cuposReservados: 0, estado: 'disponible' as const, horaSalida: '08:00' },
  { slug: 'arqueologia-en-los-valles', fecha: '2026-04-11', cuposTotales: 8, cuposReservados: 3, estado: 'disponible' as const, horaSalida: '08:00' },
  { slug: 'mallku-experience-4x4',     fecha: '2026-04-16', cuposTotales: 6, cuposReservados: 0, estado: 'disponible' as const, horaSalida: '07:30' },
  { slug: 'tucuman-colonial',          fecha: '2026-04-18', cuposTotales: 8, cuposReservados: 1, estado: 'disponible' as const, horaSalida: '08:00' },
  { slug: 'arqueologia-en-los-valles', fecha: '2026-04-25', cuposTotales: 8, cuposReservados: 7, estado: 'pocos-cupos' as const, horaSalida: '08:00' },
];

// ==========================================
// MIGRACIÓN PRINCIPAL
// ==========================================

async function main() {
  console.log('🌱 Iniciando migración de datos...\n');

  // --- STEP 1: Insertar excursiones (upsert por slug) ---
  console.log('📋 Insertando excursiones...');

  const insertedExcursions: { id: string; slug: string }[] = [];

  for (const exc of excursionesData) {
    // Verificar si ya existe
    const [existing] = await db
      .select({ id: excursions.id, slug: excursions.slug })
      .from(excursions)
      .where(eq(excursions.slug, exc.slug));

    if (existing) {
      // Actualizar (sin tocar timestamps existentes de reservas, etc.)
      await db
        .update(excursions)
        .set({
          titulo: exc.titulo,
          subtitulo: exc.subtitulo,
          descripcion: exc.descripcion,
          descripcionLarga: exc.descripcionLarga,
          duracion: exc.duracion,
          precioBase: exc.precioBase,
          grupoMax: exc.grupoMax,
          dificultad: exc.dificultad,
          highlights: exc.highlights,
          itinerario: exc.itinerario,
          incluye: exc.incluye,
          noIncluye: exc.noIncluye,
          recomendaciones: exc.recomendaciones,
          imagenPrincipal: exc.imagenPrincipal,
          galeria: exc.galeria,
          isActive: exc.isActive,
          orden: exc.orden,
          updatedAt: new Date(),
        })
        .where(eq(excursions.slug, exc.slug));

      insertedExcursions.push({ id: existing.id, slug: existing.slug });
      console.log(`  ✓ Actualizada: ${exc.slug} (id: ${existing.id})`);
    } else {
      // Insertar nueva
      const [newExc] = await db
        .insert(excursions)
        .values({
          slug: exc.slug,
          titulo: exc.titulo,
          subtitulo: exc.subtitulo,
          descripcion: exc.descripcion,
          descripcionLarga: exc.descripcionLarga,
          duracion: exc.duracion,
          precioBase: exc.precioBase,
          grupoMax: exc.grupoMax,
          dificultad: exc.dificultad,
          highlights: exc.highlights,
          itinerario: exc.itinerario,
          incluye: exc.incluye,
          noIncluye: exc.noIncluye,
          recomendaciones: exc.recomendaciones,
          imagenPrincipal: exc.imagenPrincipal,
          galeria: exc.galeria,
          isActive: exc.isActive,
          orden: exc.orden,
        })
        .returning({ id: excursions.id, slug: excursions.slug });

      insertedExcursions.push({ id: newExc.id, slug: newExc.slug });
      console.log(`  ✅ Creada: ${exc.slug} (id: ${newExc.id})`);
    }
  }

  // Mapa slug → id para usar en fechas
  const slugToId: Record<string, string> = {};
  for (const exc of insertedExcursions) {
    slugToId[exc.slug] = exc.id;
  }

  console.log('\n📅 Insertando fechas de salida...');

  // --- STEP 2: Insertar fechas (solo si no existen aún) ---
  const existingDates = await db
    .select({ id: dates.id })
    .from(dates)
    .limit(1);

  if (existingDates.length > 0) {
    console.log('  ⚠️  Ya existen fechas en la base de datos.');
    console.log('  ℹ️  Para re-insertar fechas, eliminá las existentes manualmente desde el dashboard.');
    console.log('  ✓  Omitiendo inserción de fechas.\n');
  } else {
    for (const fecha of fechasData) {
      const excursionId = slugToId[fecha.slug];

      if (!excursionId) {
        console.log(`  ❌ No se encontró excursión con slug: ${fecha.slug}`);
        continue;
      }

      const [newDate] = await db
        .insert(dates)
        .values({
          excursionId,
          fecha: new Date(`${fecha.fecha}T12:00:00.000Z`), // Mediodía UTC = mañana en ARG
          horaSalida: fecha.horaSalida,
          cuposTotales: fecha.cuposTotales,
          cuposReservados: fecha.cuposReservados,
          estado: fecha.estado,
          // precioOverride: null → usa precioBase de la excursión
        })
        .returning({ id: dates.id });

      console.log(`  ✅ ${fecha.slug} · ${fecha.fecha} (cupos: ${fecha.cuposTotales - fecha.cuposReservados}/${fecha.cuposTotales})`);
    }
  }

  // --- SUMMARY ---
  console.log('\n✅ Migración completada.\n');
  console.log('Resumen:');
  console.log(`  Excursiones procesadas: ${excursionesData.length}`);
  console.log(`  Fechas procesadas: ${existingDates.length > 0 ? '0 (ya existían)' : fechasData.length}`);
  console.log('\nVerificá en: https://mallku-api.vercel.app/api/v1/calendar');

  await client.end();
}

main().catch((err) => {
  console.error('❌ Error durante la migración:', err);
  client.end();
  process.exit(1);
});
