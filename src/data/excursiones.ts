export interface Excursion {
  slug: string;
  tag: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  descripcionLarga: string[];
  highlights: string[];
  itinerario: {
    hora: string;
    actividad: string;
    descripcion: string;
  }[];
  incluye: string[];
  noIncluye: string[];
  recomendaciones: string[];
  duracion: string;
  salida: string;
  precio: string;
  priceNote: string;
  dificultad: string;
  grupoMax: string;
  mejorEpoca: string;
  whatsappLink: string;
  imagen: string;
  imagenes: string[];
}

export const excursiones: Excursion[] = [
  {
    slug: 'arqueologia-en-los-valles',
    tag: 'Más vendido',
    titulo: 'Arqueología en los Valles',
    subtitulo: 'Quilmes, Tafí y los Menhires',
    descripcion: 'Recorrer mil años de historia andina en un día: desde los monolitos sagrados de la cultura Tafí hasta la ciudad fortificada de Quilmes, último bastión de la resistencia calchaquí.',
    descripcionLarga: [
      'Esta excursión te lleva a través de más de mil años de historia andina en un solo día. Comenzamos en el Valle de Tafí, donde la cultura Tafí dejó su huella en forma de misteriosos menhires de piedra, monolitos que aún guardan secretos sobre sus rituales y cosmovisión.',
      'Cruzamos el Abra del Infiernillo a más de 3.000 metros de altura, un paso de montaña que conecta dos mundos: las yungas húmedas y los valles secos calchaquíes. El paisaje cambia dramáticamente mientras descendemos hacia Quilmes.',
      'Quilmes fue la ciudad más grande del noroeste argentino prehispánico. Sus habitantes resistieron más de 130 años a la conquista española, siendo el último bastión de la resistencia calchaquí. Caminar entre sus terrazas es caminar por la historia viva de un pueblo que nunca se rindió.'
    ],
    highlights: [
      'Parque de los Menhires (cultura Tafí, 300 AC - 800 DC)',
      'Valle de Tafí y su esplendor paisajístico',
      'Abra del Infiernillo (3.042 msnm)',
      'Ciudad Sagrada de Quilmes (último bastión calchaquí)',
      'Almuerzo típico regional incluido'
    ],
    itinerario: [
      { hora: '08:00', actividad: 'Salida desde Tucumán', descripcion: 'La ciudad todavía duerme cuando partimos. La ruta trepa hacia el oeste mientras el sol empieza a calentar los cerros verdes del pedemonte tucumano.' },
      { hora: '09:30', actividad: 'Parque de los Menhires', descripcion: 'Más de cien monolitos de piedra tallados hace dos mil años nos reciben en silencio. Recorremos el parque descifrando rostros, símbolos y las teorías que intentan explicar su significado.' },
      { hora: '11:00', actividad: 'Valle de Tafí', descripcion: 'El valle se abre como un anfiteatro natural rodeado de cumbres. Paramos en miradores donde se siente el peso de la historia: este paisaje fue escenario de culturas que aquí vivieron durante milenios.' },
      { hora: '12:30', actividad: 'Abra del Infiernillo', descripcion: 'A 3.042 metros, el aire se vuelve fino y el paisaje cambia radicalmente. Dejamos atrás las yungas verdes y entramos en el mundo seco y luminoso de los Valles Calchaquíes. La vista es infinita.' },
      { hora: '13:30', actividad: 'Almuerzo', descripcion: 'Nos sentamos a comer en el valle. Sabores regionales, ritmo pausado, tiempo para conversar sobre lo que vimos y lo que viene. Todo incluido.' },
      { hora: '15:00', actividad: 'Ciudad Sagrada de Quilmes', descripcion: 'El momento más intenso del día. Caminamos entre las terrazas de la ciudad que resistió 130 años a la conquista española. Cada muro cuenta una historia de organización, resistencia y tragedia.' },
      { hora: '17:30', actividad: 'Regreso', descripcion: 'Emprendemos el regreso con la luz dorada de la tarde sobre los valles. Hay tiempo para paradas, preguntas y el silencio de procesar todo lo vivido.' },
      { hora: '20:00', actividad: 'Llegada', descripcion: 'Llegamos a Tucumán con mil años de historia encima. No es lo mismo la ciudad después de haber caminado Quilmes.' }
    ],
    incluye: [
      'Transporte en vehículo cómodo con aire acondicionado',
      'Guía arqueólogo especializado durante toda la excursión',
      'Entrada al Parque de los Menhires',
      'Entrada a la Ciudad Sagrada de Quilmes',
      'Almuerzo completo con bebida',
      'Seguro de responsabilidad civil',
      'Agua mineral durante el recorrido'
    ],
    noIncluye: [
      'Propinas (opcionales)',
      'Gastos personales',
      'Comidas adicionales no mencionadas'
    ],
    recomendaciones: [
      'Llevar ropa cómoda y en capas (variación de temperatura por altura)',
      'Calzado cerrado cómodo para caminar',
      'Protector solar y sombrero',
      'Agua extra personal',
      'Cámara de fotos',
      'Efectivo para compras artesanales (opcional)'
    ],
    duracion: '12 horas',
    salida: '8:00am',
    precio: '$120.000',
    priceNote: 'Todo incluido · Grupos reducidos',
    dificultad: 'Media (caminatas cortas en altura)',
    grupoMax: '6-8 personas',
    mejorEpoca: 'Abril a noviembre (clima seco, ideal para caminatas)',
    whatsappLink: 'https://wa.me/5493815702549?text=Hola%2C%20quiero%20info%20sobre%20Arqueolog%C3%ADa%20en%20los%20Valles',
    imagen: '/images/Quilmes 1.jpg',
    imagenes: [
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
    ]
  },
  {
    slug: 'tucuman-colonial',
    tag: 'Ideal familias',
    titulo: 'Tucumán Colonial',
    subtitulo: 'Ibatín, Yungas y Estancias Jesuitas',
    descripcion: 'Entender cómo nació Tucumán: desde su primera fundación en plena selva hasta el sistema de estancias jesuitas que moldeó el valle.',
    descripcionLarga: [
      'Esta excursión te lleva a los orígenes de Tucumán, a entender las decisiones, fracasos y adaptaciones que dieron forma a la provincia. Comenzamos visitando las ruinas de Ibatín, donde San Miguel de Tucumán fue fundado por primera vez en 1565.',
      'Ibatín fue abandonada en 1685 después de 120 años de existencia. Las razones fueron múltiples: ataques de pueblos originarios, inundaciones, plagas. La ciudad se trasladó a su ubicación actual, dejando atrás los restos de la primera fundación en medio de la selva.',
      'Atravesamos la Quebrada del Río Los Sosa, uno de los paisajes más impresionantes de las yungas tucumanas, antes de llegar al Valle de Tafí y conocer el legado jesuita que transformó la región con su sistema de estancias productivas.'
    ],
    highlights: [
      'Ruinas de Ibatín - Primera Fundación (1565-1685)',
      'Quebrada del Río Los Sosa (yungas tucumanas)',
      'Valle de Tafí del Valle',
      'Museo Jesuítico de La Banda',
      'Capilla histórica de La Banda'
    ],
    itinerario: [
      { hora: '08:00', actividad: 'Salida desde Tucumán', descripcion: 'Dejamos la ciudad hacia el sur, rumbo al lugar donde todo empezó. La ruta atraviesa cañaverales y el paisaje se vuelve cada vez más verde y selvático.' },
      { hora: '09:30', actividad: 'Ruinas de Ibatín', descripcion: 'Entramos en la selva donde hace 460 años se fundó Tucumán por primera vez. Entre la vegetación aparecen los cimientos de lo que fue una ciudad colonial completa: iglesia, cabildo, plaza. Contamos por qué fracasó y qué nos enseña.' },
      { hora: '11:30', actividad: 'Quebrada del Río Los Sosa', descripcion: 'La ruta se interna en una de las quebradas más espectaculares de las yungas. Helechos gigantes, cascadas, el río corriendo junto al camino. Paramos en miradores donde la selva se abre y deja ver la montaña.' },
      { hora: '13:00', actividad: 'Almuerzo en Tafí', descripcion: 'Llegamos al Valle de Tafí con hambre y con paisaje de fondo. Almorzamos con calma, rodeados de montañas y aire limpio de altura. Todo incluido.' },
      { hora: '14:30', actividad: 'Museo Jesuítico La Banda', descripcion: 'La capilla de La Banda guarda siglos de historia jesuita. Recorremos el museo donde se cuenta cómo los jesuitas transformaron el valle con su sistema de estancias y misiones.' },
      { hora: '16:00', actividad: 'Recorrido por el valle', descripcion: 'Tiempo para caminar por Tafí del Valle, sentir la brisa de la tarde y recorrer un pueblo que vive entre cerros y tradición. Ritmo libre, sin apuro.' },
      { hora: '17:00', actividad: 'Regreso', descripcion: 'Volvemos por la quebrada con la luz cambiando sobre la selva. El regreso también es parte de la experiencia.' },
      { hora: '18:00', actividad: 'Llegada', descripcion: 'De vuelta en Tucumán con otra mirada. La ciudad que hoy conocés nació de un fracaso colonial que visitaste esta mañana.' }
    ],
    incluye: [
      'Transporte en vehículo cómodo con aire acondicionado',
      'Guía especializado en historia colonial',
      'Entrada al sitio de Ibatín',
      'Entrada al Museo Jesuítico',
      'Almuerzo completo con bebida',
      'Seguro de responsabilidad civil'
    ],
    noIncluye: [
      'Propinas (opcionales)',
      'Gastos personales',
      'Comidas adicionales no mencionadas'
    ],
    recomendaciones: [
      'Llevar ropa cómoda',
      'Calzado cerrado (hay tramos de tierra)',
      'Protector solar',
      'Repelente de insectos (zona de yungas)',
      'Cámara de fotos'
    ],
    duracion: '10 horas',
    salida: '8:00am',
    precio: '$100.000',
    priceNote: 'Todo incluido · Apto todas las edades',
    dificultad: 'Baja (apto para todas las edades)',
    grupoMax: '6-8 personas',
    mejorEpoca: 'Todo el año (la selva es más verde en verano)',
    whatsappLink: 'https://wa.me/5493815702549?text=Hola%2C%20quiero%20info%20sobre%20Tucum%C3%A1n%20Colonial',
    imagen: '/images/Ibatin 1.jpg',
    imagenes: [
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
    ]
  }
];

export function getExcursionBySlug(slug: string): Excursion | undefined {
  return excursiones.find(e => e.slug === slug);
}
