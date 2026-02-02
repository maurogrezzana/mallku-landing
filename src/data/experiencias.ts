export interface DiaItinerario {
  dia: number;
  titulo: string;
  horario: string;
  alturaMaxima?: string;
  sitios: string[];
  precio: string;
  noche?: string;
  extra?: string;
}

export interface ExperienciaMultiDia {
  slug: string;
  tag: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  descripcionLarga: string[];
  duracion: string;
  dias: number;
  noches: number;
  ubicacion: string;
  puntoEncuentro: string;
  precioTotal: string;
  incluyeAlojamiento: boolean;
  alturaMaxima: string;
  dificultad: string;
  grupoMax: string;
  itinerarioPorDia: DiaItinerario[];
  incluye: string[];
  noIncluye: string[];
  recomendaciones: string[];
  whatsappLink: string;
}

export const experiencias: ExperienciaMultiDia[] = [
  {
    slug: 'mallku-experience-4x4',
    tag: 'Experiencia Premium',
    titulo: 'Mallku Experience 4x4',
    subtitulo: '4 días explorando la Puna catamarqueña',
    descripcion: 'Una aventura de 4 días por los paisajes más extremos y remotos del NOA: el Campo de Piedra Pómez, el Volcán Galán con la caldera más grande del mundo, sitios arqueológicos milenarios y las Ruinas de Shincal.',
    descripcionLarga: [
      'Mallku Experience 4x4 es nuestra expedición más ambiciosa: cuatro días recorriendo la Puna catamarqueña en vehículos 4x4, acompañados por guías baqueanos locales que conocen cada rincón de este territorio extremo.',
      'Desde formaciones geológicas únicas en el planeta como el Campo de Piedra Pómez, hasta la caldera volcánica más grande del mundo en el Volcán Galán. Desde sitios arqueológicos de 10.000 años de antigüedad hasta la capital austral del Imperio Inca en Shincal.',
      'Esta no es una excursión convencional. Es una inmersión profunda en uno de los paisajes más remotos y sobrecogedores de Argentina, donde el altiplano, los volcanes, las lagunas de altura y la historia ancestral se encuentran.'
    ],
    duracion: '4 días / 3 noches',
    dias: 4,
    noches: 3,
    ubicacion: 'Puna de Catamarca',
    puntoEncuentro: 'Belén, Catamarca',
    precioTotal: '$1.525.000',
    incluyeAlojamiento: false,
    alturaMaxima: '3.957 msnm',
    dificultad: 'Media-Alta (altura y caminos de ripio)',
    grupoMax: '4-6 personas',
    itinerarioPorDia: [
      {
        dia: 1,
        titulo: 'Campo de Piedra Pómez',
        horario: '07:30 a 17:00',
        alturaMaxima: '3.957 msnm',
        sitios: [
          'Quebrada de Belén',
          'Puerto Viejo',
          'Duna de Randolfo',
          'Reserva de la Biosfera de Laguna Blanca',
          'Mirador Pasto Ventura',
          'El Peñón (almuerzo)',
          'Mirador Volcán Carachi',
          'Recorrido lava volcánica Volcán Carachi',
          'Laguna Carachi',
          'Campo de Olas',
          'Campo de Piedra Pómez (40 min libres)'
        ],
        precio: '$425.000',
        noche: 'Antofagasta de la Sierra'
      },
      {
        dia: 2,
        titulo: 'Sitios Arqueológicos',
        horario: '08:30 a 16:00',
        alturaMaxima: '3.457 msnm',
        sitios: [
          'Volcán Antofagasta (trekking opcional)',
          'Puraca',
          'Confluencia',
          'El Coiparcito',
          'Sitio Arqueológico Punta La Peña',
          'Sitio Arqueológico Peñas Coloradas'
        ],
        precio: '$330.000',
        noche: 'Antofagasta de la Sierra'
      },
      {
        dia: 3,
        titulo: 'Volcán Galán',
        horario: '07:30 a 17:00',
        sitios: [
          'Campo de Tobas',
          'Cañón de Mirihuaca',
          'Real Grande',
          'Cañón de Real Grande',
          'Ojos de Pirica',
          'Mirador Borde Oeste Volcán Galán',
          'Laguna Diamante',
          'Géiseres Volcán Galán',
          'Mirador Borde Sur - Lagunas Pabellón y Laguna Negra',
          'Laguna Grande',
          'Laguna Cavi',
          'Campo Vicuñaro',
          'El Peñón',
          'Mirador Cerro La Herradura',
          'Mirador Volcanes Antofagasta-Alumbrera'
        ],
        precio: '$360.000',
        noche: 'Antofagasta de la Sierra',
        extra: 'Cena de despedida incluida (asado autóctono o trucha)'
      },
      {
        dia: 4,
        titulo: 'Regreso a Belén y Shincal',
        horario: 'Mañana y tarde',
        sitios: [
          'Viaje de regreso a Belén',
          'Almuerzo en Belén',
          'Ruinas de Shincal (turno tarde)'
        ],
        precio: '$410.000'
      }
    ],
    incluye: [
      'Transporte en vehículo 4x4 durante los 4 días',
      'Guía baqueano local especializado',
      'Todas las excursiones detalladas en el itinerario',
      'Entradas a sitios arqueológicos',
      'Cena de despedida (Día 3)',
      'Seguro de responsabilidad civil'
    ],
    noIncluye: [
      'Alojamiento en Antofagasta de la Sierra (3 noches)',
      'Comidas no mencionadas (desayunos, almuerzos)',
      'Traslado hasta Belén',
      'Propinas (opcionales)',
      'Gastos personales'
    ],
    recomendaciones: [
      'Llevar agua en cantidad (mínimo 2 litros por día)',
      'Ropa en capas: hace frío por la mañana y calor al mediodía',
      'Abrigo liviano pero efectivo (viento en altura)',
      'Sombrero o gorra y protector solar (radiación UV extrema)',
      'Anteojos de sol con buen filtro',
      'Calzado cómodo y cerrado para caminar',
      'Mate cebado si querés (opcional)',
      'Medicación para altura si tenés antecedentes',
      'Cámara de fotos con batería extra (el frío las agota rápido)'
    ],
    whatsappLink: 'https://wa.me/5493815702549?text=Hola%2C%20quiero%20info%20sobre%20Mallku%20Experience%204x4'
  }
];

export function getExperienciaBySlug(slug: string): ExperienciaMultiDia | undefined {
  return experiencias.find(e => e.slug === slug);
}
