import type { Excursion } from './excursiones';

export const excursiones: Excursion[] = [
  {
    slug: 'arqueologia-en-los-valles',
    tag: 'Le plus vendu',
    titulo: 'Archéologie dans les Vallées',
    subtitulo: 'Quilmes, Tafí et les Menhirs',
    descripcion: 'Parcourir mille ans d\'histoire andine en une journée : depuis les monolithes sacrés de la culture Tafí jusqu\'à la cité fortifiée de Quilmes, dernier bastion de la résistance calchaquí.',
    descripcionLarga: [
      'Cette excursion vous emmène à travers plus de mille ans d\'histoire andine en une seule journée. Nous commençons dans la Vallée de Tafí, où la culture Tafí a laissé son empreinte sous la forme de mystérieux menhirs de pierre, des monolithes qui gardent encore les secrets de leurs rituels et de leur vision du monde.',
      'Nous franchissons l\'Abra del Infiernillo à plus de 3 000 mètres d\'altitude, un col de montagne qui relie deux mondes : les yungas humides et les vallées sèches calchaquíes. Le paysage change radicalement tandis que nous descendons vers Quilmes.',
      'Quilmes fut la plus grande cité du nord-ouest argentin préhispanique. Ses habitants résistèrent plus de 130 ans à la conquête espagnole, étant le dernier bastion de la résistance calchaquí. Marcher entre ses terrasses, c\'est marcher dans l\'histoire vivante d\'un peuple qui ne s\'est jamais rendu.'
    ],
    highlights: [
      'Parc des Menhirs (culture Tafí, 300 av. J.-C. - 800 apr. J.-C.)',
      'Vallée de Tafí et sa splendeur paysagère',
      'Abra del Infiernillo (3 042 m d\'altitude)',
      'Cité Sacrée de Quilmes (dernier bastion calchaquí)',
      'Déjeuner régional typique inclus'
    ],
    itinerario: [
      { hora: '08:00', actividad: 'Départ de Tucumán', descripcion: 'La ville dort encore lorsque nous partons. La route grimpe vers l\'ouest tandis que le soleil commence à réchauffer les collines vertes du piémont tucuman.' },
      { hora: '09:30', actividad: 'Parc des Menhirs', descripcion: 'Plus d\'une centaine de monolithes de pierre taillés il y a deux mille ans nous accueillent en silence. Nous parcourons le parc en déchiffrant visages, symboles et les théories qui tentent d\'expliquer leur signification.' },
      { hora: '11:00', actividad: 'Vallée de Tafí', descripcion: 'La vallée s\'ouvre comme un amphithéâtre naturel entouré de sommets. Nous nous arrêtons à des belvédères où l\'on ressent le poids de l\'histoire : ce paysage fut le théâtre de cultures qui y vécurent durant des millénaires.' },
      { hora: '12:30', actividad: 'Abra del Infiernillo', descripcion: 'À 3 042 mètres, l\'air se raréfie et le paysage change radicalement. Nous laissons derrière nous les yungas verdoyantes pour entrer dans le monde sec et lumineux des Vallées Calchaquíes. La vue est infinie.' },
      { hora: '13:30', actividad: 'Déjeuner', descripcion: 'Nous nous installons pour manger dans la vallée. Saveurs régionales, rythme tranquille, le temps de converser sur ce que nous avons vu et ce qui nous attend. Tout est inclus.' },
      { hora: '15:00', actividad: 'Cité Sacrée de Quilmes', descripcion: 'Le moment le plus intense de la journée. Nous marchons entre les terrasses de la cité qui résista 130 ans à la conquête espagnole. Chaque mur raconte une histoire d\'organisation, de résistance et de tragédie.' },
      { hora: '17:30', actividad: 'Retour', descripcion: 'Nous reprenons la route avec la lumière dorée de l\'après-midi sur les vallées. Il y a le temps pour des arrêts, des questions et le silence nécessaire pour assimiler tout ce que nous avons vécu.' },
      { hora: '20:00', actividad: 'Arrivée', descripcion: 'Nous arrivons à Tucumán avec mille ans d\'histoire en nous. La ville n\'est plus la même après avoir foulé Quilmes.' }
    ],
    incluye: [
      'Transport en véhicule confortable avec climatisation',
      'Guide archéologue spécialisé pendant toute l\'excursion',
      'Entrée au Parc des Menhirs',
      'Entrée à la Cité Sacrée de Quilmes',
      'Déjeuner complet avec boisson',
      'Assurance responsabilité civile',
      'Eau minérale pendant le parcours'
    ],
    noIncluye: [
      'Pourboires (facultatifs)',
      'Dépenses personnelles',
      'Repas supplémentaires non mentionnés'
    ],
    recomendaciones: [
      'Apporter des vêtements confortables et en couches (variation de température selon l\'altitude)',
      'Chaussures fermées et confortables pour la marche',
      'Crème solaire et chapeau',
      'Eau supplémentaire personnelle',
      'Appareil photo',
      'Espèces pour achats artisanaux (facultatif)'
    ],
    duracion: '12 heures',
    salida: '8:00am',
    precio: '$120.000',
    priceNote: 'Tout compris · Petits groupes',
    dificultad: 'Moyenne (courtes marches en altitude)',
    grupoMax: '6-8 personnes',
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
    tag: 'Idéal familles',
    titulo: 'Tucumán Colonial',
    subtitulo: 'Ibatín, Yungas et Estancias Jésuites',
    descripcion: 'Comprendre comment Tucumán est née : depuis sa première fondation en pleine forêt tropicale jusqu\'au système d\'estancias jésuites qui a façonné la vallée.',
    descripcionLarga: [
      'Cette excursion vous emmène aux origines de Tucumán, pour comprendre les décisions, les échecs et les adaptations qui ont donné forme à la province. Nous commençons par visiter les ruines d\'Ibatín, où San Miguel de Tucumán fut fondée pour la première fois en 1565.',
      'Ibatín fut abandonnée en 1685 après 120 ans d\'existence. Les raisons furent multiples : attaques des peuples autochtones, inondations, épidémies. La ville fut déplacée vers son emplacement actuel, laissant derrière elle les vestiges de la première fondation au milieu de la forêt.',
      'Nous traversons la Quebrada del Río Los Sosa, l\'un des paysages les plus impressionnants des yungas tucumanes, avant d\'arriver à la Vallée de Tafí et de découvrir l\'héritage jésuite qui transforma la région avec son système d\'estancias productives.'
    ],
    highlights: [
      'Ruines d\'Ibatín - Première Fondation (1565-1685)',
      'Quebrada del Río Los Sosa (yungas tucumanes)',
      'Vallée de Tafí del Valle',
      'Musée Jésuite de La Banda',
      'Chapelle historique de La Banda'
    ],
    itinerario: [
      { hora: '08:00', actividad: 'Départ de Tucumán', descripcion: 'Nous quittons la ville vers le sud, en direction du lieu où tout a commencé. La route traverse des champs de canne à sucre et le paysage devient de plus en plus vert et tropical.' },
      { hora: '09:30', actividad: 'Ruines d\'Ibatín', descripcion: 'Nous pénétrons dans la forêt où, il y a 460 ans, Tucumán fut fondée pour la première fois. Entre la végétation apparaissent les fondations de ce qui fut une ville coloniale complète : église, cabildo, place. Nous racontons pourquoi elle a échoué et ce qu\'elle nous enseigne.' },
      { hora: '11:30', actividad: 'Quebrada del Río Los Sosa', descripcion: 'La route s\'enfonce dans l\'une des gorges les plus spectaculaires des yungas. Fougères géantes, cascades, la rivière courant le long du chemin. Nous nous arrêtons à des belvédères où la forêt s\'ouvre et laisse voir la montagne.' },
      { hora: '13:00', actividad: 'Déjeuner à Tafí', descripcion: 'Nous arrivons dans la Vallée de Tafí affamés et avec un paysage en toile de fond. Nous déjeunons tranquillement, entourés de montagnes et d\'air pur d\'altitude. Tout est inclus.' },
      { hora: '14:30', actividad: 'Musée Jésuite La Banda', descripcion: 'La chapelle de La Banda garde des siècles d\'histoire jésuite. Nous parcourons le musée qui raconte comment les jésuites ont transformé la vallée avec leur système d\'estancias et de missions.' },
      { hora: '16:00', actividad: 'Promenade dans la vallée', descripcion: 'Le temps de se promener dans Tafí del Valle, de sentir la brise de l\'après-midi et de parcourir un village qui vit entre montagnes et tradition. Rythme libre, sans hâte.' },
      { hora: '17:00', actividad: 'Retour', descripcion: 'Nous revenons par la gorge avec la lumière changeante sur la forêt. Le retour fait aussi partie de l\'expérience.' },
      { hora: '18:00', actividad: 'Arrivée', descripcion: 'De retour à Tucumán avec un autre regard. La ville que vous connaissez aujourd\'hui est née d\'un échec colonial que vous avez visité ce matin.' }
    ],
    incluye: [
      'Transport en véhicule confortable avec climatisation',
      'Guide spécialisé en histoire coloniale',
      'Entrée au site d\'Ibatín',
      'Entrée au Musée Jésuite',
      'Déjeuner complet avec boisson',
      'Assurance responsabilité civile'
    ],
    noIncluye: [
      'Pourboires (facultatifs)',
      'Dépenses personnelles',
      'Repas supplémentaires non mentionnés'
    ],
    recomendaciones: [
      'Apporter des vêtements confortables',
      'Chaussures fermées (il y a des tronçons de terre)',
      'Crème solaire',
      'Répulsif anti-insectes (zone de yungas)',
      'Appareil photo'
    ],
    duracion: '10 heures',
    salida: '8:00am',
    precio: '$100.000',
    priceNote: 'Tout compris · Tous âges',
    dificultad: 'Facile (adapté à tous les âges)',
    grupoMax: '6-8 personnes',
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
