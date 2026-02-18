import type { ExperienciaMultiDia, DiaItinerario } from './experiencias';

export const experiencias: ExperienciaMultiDia[] = [
  {
    slug: 'mallku-experience-4x4',
    tag: 'Expérience Premium',
    titulo: 'Mallku Experience 4x4',
    subtitulo: '4 jours à explorer la Puna de Catamarca',
    descripcion: 'Une aventure de 4 jours à travers les paysages les plus extrêmes et reculés du NOA : le Champ de Pierre Ponce, le Volcan Galán avec la plus grande caldeira du monde, des sites archéologiques millénaires et les Ruines de Shincal.',
    descripcionLarga: [
      'Mallku Experience 4x4 est notre expédition la plus ambitieuse : quatre jours à parcourir la Puna de Catamarca en véhicules 4x4, accompagnés par des guides locaux experts qui connaissent chaque recoin de ce territoire extrême.',
      'Des formations géologiques uniques au monde comme le Champ de Pierre Ponce, jusqu\'à la plus grande caldeira volcanique du monde au Volcan Galán. Des sites archéologiques vieux de 10 000 ans jusqu\'à la capitale australe de l\'Empire Inca à Shincal.',
      'Ce n\'est pas une excursion conventionnelle. C\'est une immersion profonde dans l\'un des paysages les plus reculés et saisissants d\'Argentine, où l\'altiplano, les volcans, les lagunes d\'altitude et l\'histoire ancestrale se rencontrent.'
    ],
    duracion: '4 jours / 3 nuits',
    dias: 4,
    noches: 3,
    ubicacion: 'Puna de Catamarca',
    puntoEncuentro: 'Belén, Catamarca',
    precioTotal: '$1.525.000',
    incluyeAlojamiento: false,
    alturaMaxima: '3.957 msnm',
    dificultad: 'Moyenne-Haute (altitude et pistes de terre)',
    grupoMax: '4-6 personnes',
    itinerarioPorDia: [
      {
        dia: 1,
        titulo: 'Champ de Pierre Ponce',
        horario: '07:30 a 17:00',
        alturaMaxima: '3.957 msnm',
        sitios: [
          'Quebrada de Belén',
          'Puerto Viejo',
          'Duna de Randolfo',
          'Reserva de la Biosfera de Laguna Blanca',
          'Mirador Pasto Ventura',
          'El Peñón (déjeuner)',
          'Mirador Volcán Carachi',
          'Parcours lave volcanique Volcán Carachi',
          'Laguna Carachi',
          'Campo de Olas',
          'Champ de Pierre Ponce (40 min libres)'
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
        titulo: 'Sites Archéologiques',
        horario: '08:30 a 16:00',
        alturaMaxima: '3.457 msnm',
        sitios: [
          'Volcán Antofagasta (trekking facultatif)',
          'Puraca',
          'Confluencia',
          'El Coiparcito',
          'Site Archéologique Punta La Peña',
          'Site Archéologique Peñas Coloradas'
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
        titulo: 'Volcan Galán',
        horario: '07:30 a 17:00',
        sitios: [
          'Campo de Tobas',
          'Cañón de Mirihuaca',
          'Real Grande',
          'Cañón de Real Grande',
          'Ojos de Pirica',
          'Mirador Borde Ouest Volcán Galán',
          'Laguna Diamante',
          'Geysers Volcán Galán',
          'Mirador Borde Sud - Lagunas Pabellón et Laguna Negra',
          'Laguna Grande',
          'Laguna Cavi',
          'Campo Vicuñaro',
          'El Peñón',
          'Mirador Cerro La Herradura',
          'Mirador Volcanes Antofagasta-Alumbrera'
        ],
        precio: '$360.000',
        noche: 'Antofagasta de la Sierra',
        extra: 'Dîner d\'adieu inclus (asado autochtone ou truite)',
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
        titulo: 'Retour à Belén et Shincal',
        horario: 'Matin et après-midi',
        sitios: [
          'Trajet retour vers Belén',
          'Déjeuner à Belén',
          'Ruines de Shincal (créneau après-midi)'
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
      'Transport en véhicule 4x4 pendant les 4 jours',
      'Guide local expert spécialisé',
      'Toutes les excursions détaillées dans l\'itinéraire',
      'Entrées aux sites archéologiques',
      'Dîner d\'adieu (Jour 3)',
      'Assurance responsabilité civile'
    ],
    noIncluye: [
      'Hébergement à Antofagasta de la Sierra (3 nuits)',
      'Repas non mentionnés (petits-déjeuners, déjeuners)',
      'Transfert jusqu\'à Belén',
      'Pourboires (facultatifs)',
      'Dépenses personnelles'
    ],
    recomendaciones: [
      'Apporter de l\'eau en quantité (minimum 2 litres par jour)',
      'Vêtements en couches : il fait froid le matin et chaud à midi',
      'Veste légère mais efficace (vent en altitude)',
      'Chapeau ou casquette et crème solaire (rayonnement UV extrême)',
      'Lunettes de soleil avec bon filtre',
      'Chaussures confortables et fermées pour la marche',
      'Maté préparé si vous le souhaitez (facultatif)',
      'Médicaments pour l\'altitude si vous avez des antécédents',
      'Appareil photo avec batterie de rechange (le froid les épuise vite)'
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
