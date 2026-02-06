export interface DiaItinerario {
  dia: number;
  titulo: string;
  horario: string;
  alturaMaxima?: string;
  sitios: string[];
  precio: string;
  noche?: string;
  extra?: string;
  imagenes?: string[];
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
  imagen: string;
  imagenes: string[];
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
        noche: 'Antofagasta de la Sierra',
        imagenes: [
          '/images/ANS.jpg',
          '/images/ANS 2.jpg',
          '/images/ANS 3.jpg',
          '/images/ANS 4.jpg',
          '/images/ANS 5.jpg',
          '/images/Dunas.JPG',
          '/images/Campo las tobas 1.jpg',
          '/images/Campo las tobas 2.jpg',
        ]
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
        noche: 'Antofagasta de la Sierra',
        imagenes: [
          '/images/Confluencia 1.JPG',
          '/images/Confluencia 2.jpg',
          '/images/Confluencia 3.JPG',
          '/images/Confluencia 4.JPG',
          '/images/Confluencia 5.JPG',
          '/images/Confluencia 6.JPG',
          '/images/Pucara los Negros 1.jpg',
          '/images/Pucara los Negros 2.jpg',
          '/images/Pucara los Negros 3.jpg',
          '/images/Pucara los negros 4.jpg',
          '/images/Quebrada seca 1.jpg',
          '/images/Quebrada seca 2.jpg',
        ]
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
        extra: 'Cena de despedida incluida (asado autóctono o trucha)',
        imagenes: [
          '/images/real grande.jpg',
          '/images/Real Grande 2.jpg',
          '/images/Real Grande 3.jpg',
          '/images/Real Grande 4.jpg',
          '/images/Real Grande 5.jpg',
          '/images/Real Grande 6.jpg',
          '/images/Real Grande 7.jpg',
          '/images/Real Grande 8.jpg',
          '/images/Real Grande 9.jpg',
          '/images/real grande 10.jpg',
          '/images/Real Grande 11.jpg',
          '/images/Real Grande 12.jpg',
          '/images/Real Grande 13.jpg',
          '/images/Real Grande 14.jpg',
          '/images/Real Grande 15.jpg',
          '/images/Real Grande 16.jpg',
          '/images/Real Grande 17.jpg',
        ]
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
        precio: '$410.000',
        imagenes: [
          '/images/4x4.png',
          '/images/4x4 2.png',
          '/images/4x4 3.png',
          '/images/4x4 4.png',
          '/images/4x4 5.jpg',
          '/images/Rancho el tuichy.jpg',
        ]
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
    whatsappLink: 'https://wa.me/5493815702549?text=Hola%2C%20quiero%20info%20sobre%20Mallku%20Experience%204x4',
    imagen: '/images/4x4.png',
    imagenes: [
      '/images/4x4.png',
      '/images/4x4 2.png',
      '/images/4x4 3.png',
      '/images/4x4 4.png',
      '/images/4x4 5.jpg',
      '/images/ANS 6.jpg',
      '/images/ANS 7.jpg',
      '/images/ANS 8.jpg',
      '/images/ANS 9.jpg',
      '/images/ANS 10.jpg',
      '/images/ANS 11.jpg',
      '/images/ANS 12.jpg',
      '/images/ANS 13.jpg',
      '/images/ANS 14.jpg',
      '/images/ANS 15.jpg',
      '/images/ANS 16.jpg',
      '/images/ANS 17.jpg',
      '/images/ANS 18.jpg',
      '/images/ANS 19.jpg',
      '/images/ANS 20.jpg',
      '/images/ANS 21.jpg',
    ]
  }
];

export function getExperienciaBySlug(slug: string): ExperienciaMultiDia | undefined {
  return experiencias.find(e => e.slug === slug);
}
