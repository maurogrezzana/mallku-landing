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
  mejorEpoca: string;
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
    incluyeAlojamiento: true,
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
          'Pucará de Alumbrera',
          'Confluencia',
          'Peñas Coloradas',
          'Volcán Antofagasta (trekking opcional)'
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
          'Campo de Las Tobas',
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
          'Mirador Cerro La Herradura',
          'Mirador Volcanes Antofagasta-Alumbrera'
        ],
        precio: '$360.000',
        noche: 'Antofagasta de la Sierra',
        extra: 'Cena de despedida incluida (parrillada)',
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
        titulo: 'Regreso a Belén y El Shincal de Quimivil',
        horario: 'Mañana y tarde',
        sitios: [
          'Viaje de regreso a Belén',
          'Visita a El Shincal de Quimivil'
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
      'Alojamiento en Antofagasta de la Sierra (3 noches)',
      'Guía baqueano local especializado',
      'Todas las excursiones detalladas en el itinerario',
      'Entradas a sitios arqueológicos',
      'Cena de despedida (Día 3)',
      'Seguro de responsabilidad civil'
    ],
    noIncluye: [
      'Comidas (almuerzo y cena)',
      'Propinas (opcionales)',
      'Gastos personales'
    ],
    recomendaciones: [
      'Hidratación: llevar al menos 2 litros de agua por jornada. La altura y el clima seco aceleran la deshidratación.',
      'Vestimenta técnica en capas: la amplitud térmica puede superar los 30 °C entre la mañana y el mediodía.',
      'Cortaviento o campera liviana resistente al viento. En altura, las ráfagas son constantes.',
      'Protección solar de alto factor y sombrero o gorra. La radiación UV en la Puna es extrema.',
      'Lentes de sol con filtro UV certificado. Imprescindible para recorridos prolongados.',
      'Calzado cerrado con buena suela, apto para terrenos irregulares y caminatas en ripio.',
      'Consultar con un médico si se tiene predisposición al mal de altura (apunamiento). Llevar medicación preventiva si corresponde.',
      'Batería y memoria extra para cámaras o teléfonos. Las bajas temperaturas reducen significativamente la autonomía de los dispositivos.'
    ],
    mejorEpoca: 'Marzo a noviembre (evitar temporada de lluvias dic-feb)',
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
