export interface Post {
  slug: string;
  titulo: string;
  excerpt: string;
  contenido: string[];
  fecha: string;
  categoria: string;
  autor: string;
  tiempoLectura: string;
  imagen: string;
}

export const posts: Post[] = [
  {
    slug: 'quilmes-historia-resistencia-calchaqui',
    titulo: 'Quilmes: Historia de la resistencia calchaquí',
    excerpt: 'La Ciudad Sagrada de Quilmes fue el último bastión de la resistencia indígena frente al avance español. Conocé la historia de un pueblo que resistió más de 130 años.',
    contenido: [
      'Quilmes no es solo un sitio arqueológico. Es el testimonio más imponente de la resistencia calchaquí frente a la conquista española. Esta ciudad fortificada, ubicada en los Valles Calchaquíes de Tucumán, fue hogar de más de 5.000 personas en su momento de esplendor.',
      'Los Quilmes eran parte del pueblo Diaguita, una confederación de pueblos que habitaron el noroeste argentino. Su ciudad, construida sobre las laderas del cerro Alto del Rey, fue diseñada estratégicamente: terrazas agrícolas en las zonas bajas, viviendas en las laderas y puestos de observación en las cimas.',
      'Lo que hace única a Quilmes es su historia de resistencia. Cuando los españoles llegaron al valle a mediados del siglo XVI, los Quilmes se negaron a someterse. Durante más de 130 años resistieron, aliándose con otros pueblos diaguitas en las famosas Guerras Calchaquíes.',
      'Recién en 1667, después de tres grandes guerras y múltiples campañas militares, los españoles lograron someter definitivamente a los Quilmes. Pero la conquista no terminó ahí: el castigo fue brutal. Más de 2.000 sobrevivientes fueron forzados a caminar hasta Buenos Aires, donde fueron reubicados en una reducción que hoy conocemos como... Quilmes, la ciudad bonaerense.',
      'Caminar hoy entre las ruinas de Quilmes es caminar por la historia viva de un pueblo que nunca se rindió fácilmente. Las terrazas, los morteros, las murallas, todo habla de una sociedad organizada, próspera y profundamente conectada con su territorio.',
      'En nuestras excursiones, no solo recorremos el sitio: lo interpretamos. Contamos la historia que los carteles no cuentan, las decisiones políticas, las alianzas, las traiciones, y el impacto que este proceso tuvo en la configuración del noroeste argentino.'
    ],
    fecha: '2024-02-15',
    categoria: 'Historia',
    autor: 'Equipo Mallku',
    tiempoLectura: '6 min',
    imagen: '/images/Quilmes 1.jpg'
  },
  {
    slug: 'menhires-tafi-misterios-piedra',
    titulo: 'Los menhires de Tafí: misterios en piedra',
    excerpt: 'Los menhires del Valle de Tafí son los monumentos megalíticos más antiguos de Argentina. ¿Qué representan? ¿Quiénes los crearon? Exploramos las teorías y certezas.',
    contenido: [
      'En el corazón del Valle de Tafí, a más de 2.000 metros de altura, se encuentran los menhires más antiguos de Argentina. Estos monolitos de piedra, algunos de más de 3 metros de altura, fueron tallados por la cultura Tafí hace más de 2.000 años.',
      'La cultura Tafí habitó el valle entre el 300 a.C. y el 800 d.C., antes de la llegada de otras culturas andinas como los diaguitas. Eran agricultores y pastores que desarrollaron un sistema único de organización social, dejando como legado estos misteriosos monolitos.',
      '¿Qué representan los menhires? Esta pregunta ha fascinado a arqueólogos desde el siglo XIX. Algunas teorías sugieren que eran marcadores territoriales, otras que representaban ancestros o espíritus protectores. Lo que sabemos con certeza es que muchos de ellos tienen rostros tallados: ojos, narices, bocas, y en algunos casos, adornos y tocados.',
      'El Parque de los Menhires, creado en los años 70, reúne más de 100 de estos monolitos que fueron trasladados desde distintos puntos del valle. Aunque el traslado fue controvertido (los menhires perdieron su contexto original), permitió preservarlos y estudiarlos sistemáticamente.',
      'Lo más interesante es que los menhires no estaban solos. En las excavaciones se encontraron asociados a círculos de piedra, montículos y estructuras que sugieren espacios ceremoniales. Algunos investigadores proponen que formaban parte de un paisaje sagrado más amplio, donde cada elemento tenía un significado específico.',
      'En nuestras excursiones al Valle de Tafí, visitamos el Parque de los Menhires con interpretación especializada. Explicamos las distintas teorías, mostramos los detalles de las tallas, y conectamos estos monumentos con la cosmovisión andina que todavía pervive en la región.'
    ],
    fecha: '2024-01-28',
    categoria: 'Arqueología',
    autor: 'Equipo Mallku',
    tiempoLectura: '5 min',
    imagen: '/images/menhires 1.jpg'
  },
  {
    slug: 'ibatin-ciudad-perdida-tucuman',
    titulo: 'Ibatín: la ciudad perdida de Tucumán',
    excerpt: 'Antes de la actual San Miguel, existió otra Tucumán. Ibatín fue la primera fundación, abandonada después de 120 años. ¿Por qué fracasó? ¿Qué queda de ella?',
    contenido: [
      'Pocos tucumanos saben que su ciudad tuvo dos fundaciones. La primera, conocida como San Miguel de Tucumán del Ibatín, fue establecida en 1565 por Diego de Villarroel en un sitio muy diferente al actual: en plena selva de yungas, cerca de la actual localidad de Monteros.',
      'Ibatín funcionó como ciudad durante 120 años. Tenía cabildo, iglesia, plaza central y una población que llegó a superar los 2.000 habitantes entre españoles, criollos, indígenas y africanos esclavizados. Era un punto clave en la ruta comercial entre el Alto Perú y Buenos Aires.',
      '¿Por qué se abandonó? Las razones fueron múltiples y se acumularon con el tiempo. El clima húmedo y cálido favorecía las enfermedades tropicales. Las inundaciones del río Pueblo Viejo arrasaban cultivos y estructuras. Los ataques de pueblos originarios de la zona eran frecuentes. Y la ubicación, inicialmente estratégica, dejó de serlo cuando cambiaron las rutas comerciales.',
      'En 1685, después de años de peticiones al virrey, los vecinos de Ibatín recibieron autorización para trasladarse. La nueva ciudad se fundó donde hoy está San Miguel de Tucumán: un sitio más seco, más alto y mejor conectado.',
      'De Ibatín quedaron las ruinas cubiertas por la selva. Excavaciones arqueológicas han recuperado cerámicas, herramientas, cimientos de edificios y objetos de la vida cotidiana colonial. El sitio es un documento único para entender cómo era la vida en una ciudad colonial del siglo XVI.',
      'En nuestra excursión "Tucumán Colonial" visitamos las ruinas de Ibatín con interpretación histórica. Explicamos el proceso de fundación, la vida cotidiana, las razones del abandono y cómo este episodio moldeó la identidad tucumana.'
    ],
    fecha: '2024-01-10',
    categoria: 'Historia',
    autor: 'Equipo Mallku',
    tiempoLectura: '5 min',
    imagen: '/images/Ibatin 1.jpg'
  },
  {
    slug: 'guia-preparar-excursion-arqueologica',
    titulo: 'Guía para preparar tu excursión arqueológica',
    excerpt: 'Todo lo que necesitás saber antes de sumarte a una excursión arqueológica: qué llevar, cómo prepararte físicamente, qué esperar del recorrido.',
    contenido: [
      'Participar de una excursión arqueológica es diferente a un tour turístico convencional. Los sitios que visitamos suelen estar en altura, alejados de los centros urbanos, y requieren caminatas moderadas. Prepararse bien hace toda la diferencia.',
      'ROPA Y CALZADO: Usá ropa cómoda y en capas. En los Valles Calchaquíes podés arrancar el día con frío (10°C) y terminar con calor (25°C). Llevá una campera liviana que corte el viento, remera de manga larga para el sol, y pantalón cómodo. El calzado es clave: usá zapatillas cerradas con buena suela, idealmente ya usadas para evitar ampollas.',
      'PROTECCIÓN SOLAR: El sol de altura es intenso. Llevá protector solar factor 50+, sombrero o gorra, y anteojos de sol. Aunque esté nublado, la radiación UV es fuerte por encima de los 2.000 metros.',
      'HIDRATACIÓN: Nosotros proveemos agua durante el recorrido, pero recomendamos llevar una botella personal. En altura te deshidratás más rápido aunque no sientas sed.',
      'ALTURA: Si no estás acostumbrado a la altura, es normal sentir un poco de fatiga o dolor de cabeza leve. Evitá comidas pesadas la noche anterior, dormí bien, y avisanos si sentís malestar durante el recorrido. Las caminatas son a ritmo tranquilo justamente para permitir la aclimatación.',
      'QUÉ LLEVAR: Cámara o celular con batería cargada (los paisajes son increíbles). Efectivo para compras artesanales opcionales. Medicación personal si tomás alguna. Documento de identidad.',
      'QUÉ ESPERAR: No somos un tour de fotos rápidas. Nuestras excursiones son interpretativas: caminamos, paramos, explicamos, preguntamos. Es una experiencia de aprendizaje en el lugar. Vení con curiosidad y ganas de escuchar.',
      'CONDICIÓN FÍSICA: "Arqueología en los Valles" requiere caminatas moderadas en terreno irregular, subiendo algunos tramos. Si tenés movilidad reducida o condiciones de salud particulares, consultanos antes. "Tucumán Colonial" es más accesible y apta para todas las edades.'
    ],
    fecha: '2024-02-01',
    categoria: 'Guías',
    autor: 'Equipo Mallku',
    tiempoLectura: '4 min',
    imagen: '/images/Tafi del Valle.jpg'
  }
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug);
}

export function getPostsByCategoria(categoria: string): Post[] {
  return posts.filter(p => p.categoria === categoria);
}
