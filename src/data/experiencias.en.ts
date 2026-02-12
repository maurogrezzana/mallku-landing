import type { ExperienciaMultiDia } from './experiencias';

export const experiencias: ExperienciaMultiDia[] = [
  {
    slug: 'mallku-experience-4x4',
    tag: 'Premium Experience',
    titulo: 'Mallku Experience 4x4',
    subtitulo: '4 days exploring the Catamarca Puna',
    descripcion: 'A 4-day adventure through the most extreme and remote landscapes of northwestern Argentina: the Pumice Stone Field, the Galan Volcano with the largest caldera in the world, ancient archaeological sites, and the Ruins of Shincal.',
    descripcionLarga: [
      'Mallku Experience 4x4 is our most ambitious expedition: four days traversing the Catamarca Puna in 4x4 vehicles, accompanied by local expert guides who know every corner of this extreme territory.',
      'From geological formations unique on the planet like the Pumice Stone Field, to the largest volcanic caldera in the world at Galan Volcano. From archaeological sites dating back 10,000 years to the southern capital of the Inca Empire at Shincal.',
      'This is not a conventional excursion. It is a deep immersion into one of the most remote and awe-inspiring landscapes in Argentina, where the high plateau, volcanoes, high-altitude lagoons, and ancestral history converge.'
    ],
    duracion: '4 days / 3 nights',
    dias: 4,
    noches: 3,
    ubicacion: 'Catamarca Puna',
    puntoEncuentro: 'Belen, Catamarca',
    precioTotal: '$1.525.000',
    incluyeAlojamiento: false,
    alturaMaxima: '3,957 m.a.s.l.',
    dificultad: 'Medium-High (altitude and dirt roads)',
    grupoMax: '4-6 people',
    itinerarioPorDia: [
      {
        dia: 1,
        titulo: 'Pumice Stone Field',
        horario: '07:30 a 17:00',
        alturaMaxima: '3,957 m.a.s.l.',
        sitios: [
          'Belen Gorge',
          'Puerto Viejo',
          'Randolfo Dune',
          'Laguna Blanca Biosphere Reserve',
          'Pasto Ventura Viewpoint',
          'El Penon (lunch)',
          'Carachi Volcano Viewpoint',
          'Carachi Volcano lava field walk',
          'Laguna Carachi',
          'Wave Field',
          'Pumice Stone Field (40 min free time)'
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
        titulo: 'Archaeological Sites',
        horario: '08:30 a 16:00',
        alturaMaxima: '3,457 m.a.s.l.',
        sitios: [
          'Antofagasta Volcano (optional trekking)',
          'Puraca',
          'Confluencia',
          'El Coiparcito',
          'Punta La Pena Archaeological Site',
          'Penas Coloradas Archaeological Site'
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
        titulo: 'Galan Volcano',
        horario: '07:30 a 17:00',
        sitios: [
          'Tobas Field',
          'Mirihuaca Canyon',
          'Real Grande',
          'Real Grande Canyon',
          'Ojos de Pirica',
          'West Rim Viewpoint - Galan Volcano',
          'Laguna Diamante',
          'Galan Volcano Geysers',
          'South Rim Viewpoint - Pabellon and Laguna Negra Lagoons',
          'Laguna Grande',
          'Laguna Cavi',
          'Vicuna Field',
          'El Penon',
          'Cerro La Herradura Viewpoint',
          'Antofagasta-Alumbrera Volcanoes Viewpoint'
        ],
        precio: '$360.000',
        noche: 'Antofagasta de la Sierra',
        extra: 'Farewell dinner included (local barbecue or trout)',
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
        titulo: 'Return to Belen and Shincal',
        horario: 'Morning and afternoon',
        sitios: [
          'Return trip to Belen',
          'Lunch in Belen',
          'Shincal Ruins (afternoon slot)'
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
      '4x4 vehicle transportation for all 4 days',
      'Specialized local expert guide',
      'All excursions detailed in the itinerary',
      'Admission to archaeological sites',
      'Farewell dinner (Day 3)',
      'Liability insurance'
    ],
    noIncluye: [
      'Accommodation in Antofagasta de la Sierra (3 nights)',
      'Meals not mentioned (breakfasts, lunches)',
      'Transfer to Belen',
      'Tips (optional)',
      'Personal expenses'
    ],
    recomendaciones: [
      'Bring plenty of water (minimum 2 liters per day)',
      'Layered clothing: cold in the morning, warm at midday',
      'Light but effective jacket (wind at altitude)',
      'Hat or cap and sunscreen (extreme UV radiation)',
      'Sunglasses with good UV filter',
      'Comfortable closed-toe walking shoes',
      'Mate thermos if you wish (optional)',
      'Altitude medication if you have a history of altitude sickness',
      'Camera with extra battery (the cold drains them quickly)'
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
