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
  whatsappLink: string;
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
      { hora: '08:00', actividad: 'Salida desde Tucumán', descripcion: 'Partimos desde punto de encuentro acordado en San Miguel de Tucumán' },
      { hora: '09:30', actividad: 'Parque de los Menhires', descripcion: 'Visita guiada al sitio arqueológico con interpretación de la cultura Tafí' },
      { hora: '11:00', actividad: 'Valle de Tafí', descripcion: 'Recorrido panorámico, parada en miradores y contexto histórico del valle' },
      { hora: '12:30', actividad: 'Abra del Infiernillo', descripcion: 'Cruce del paso de montaña a 3.042 msnm con parada para fotos' },
      { hora: '13:30', actividad: 'Almuerzo', descripcion: 'Almuerzo típico regional en restaurante local (incluido)' },
      { hora: '15:00', actividad: 'Ciudad Sagrada de Quilmes', descripcion: 'Visita completa al sitio arqueológico con interpretación histórica profunda' },
      { hora: '17:30', actividad: 'Regreso', descripcion: 'Retorno a Tucumán con paradas opcionales' },
      { hora: '20:00', actividad: 'Llegada', descripcion: 'Llegada estimada a San Miguel de Tucumán' }
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
    whatsappLink: 'https://wa.me/5493815702549?text=Hola%2C%20quiero%20info%20sobre%20Arqueolog%C3%ADa%20en%20los%20Valles'
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
      { hora: '08:00', actividad: 'Salida desde Tucumán', descripcion: 'Partimos hacia el sur de la provincia' },
      { hora: '09:30', actividad: 'Ruinas de Ibatín', descripcion: 'Visita al sitio de la primera fundación con contexto histórico completo' },
      { hora: '11:30', actividad: 'Quebrada del Río Los Sosa', descripcion: 'Recorrido por la selva de yungas con paradas panorámicas' },
      { hora: '13:00', actividad: 'Almuerzo en Tafí', descripcion: 'Almuerzo en el valle (incluido)' },
      { hora: '14:30', actividad: 'Museo Jesuítico La Banda', descripcion: 'Visita al museo y capilla con historia de las estancias jesuitas' },
      { hora: '16:00', actividad: 'Recorrido por el valle', descripcion: 'Paseo por Tafí del Valle con tiempo libre' },
      { hora: '17:00', actividad: 'Regreso', descripcion: 'Retorno a Tucumán' },
      { hora: '18:00', actividad: 'Llegada', descripcion: 'Llegada estimada a San Miguel de Tucumán' }
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
    whatsappLink: 'https://wa.me/5493815702549?text=Hola%2C%20quiero%20info%20sobre%20Tucum%C3%A1n%20Colonial'
  }
];

export function getExcursionBySlug(slug: string): Excursion | undefined {
  return excursiones.find(e => e.slug === slug);
}
