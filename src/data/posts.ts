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
    imagen: '/images/quilmes 4.jpg'
  },
  {
    slug: 'volcan-galan-caldera-mas-grande-del-mundo',
    titulo: 'Volcán Galán: la caldera más grande del mundo',
    excerpt: 'En la Puna catamarqueña se esconde una de las formaciones geológicas más impresionantes del planeta. El Volcán Galán alberga la caldera volcánica más grande del mundo, y casi nadie lo sabe.',
    contenido: [
      'A más de 5.000 metros de altura, en el corazón de la Puna catamarqueña, el Volcán Galán guarda un récord que pocos conocen: su caldera de 40 kilómetros de diámetro es la más grande del mundo. Para dimensionarlo, dentro de ella cabría cómodamente una ciudad como Buenos Aires.',
      'El Galán hizo erupción hace aproximadamente 2,5 millones de años en un evento de proporciones casi inimaginables. La explosión fue tan violenta que expulsó más de 1.000 kilómetros cúbicos de material volcánico, un volumen que supera con creces las erupciones más conocidas de la historia moderna.',
      'Lo que queda hoy es un paisaje que parece de otro planeta. La caldera está rodeada de picos que superan los 5.900 metros, mientras que su interior alberga lagunas de colores intensos donde flamencos rosados se alimentan en silencio. El contraste entre la aridez extrema y la vida que persiste es sobrecogedor.',
      'Pero el Galán no es solo geología. En sus inmediaciones se han encontrado evidencias de presencia humana que datan de miles de años. Los pueblos originarios de la Puna conocían este paisaje, lo transitaban y probablemente lo veneraban. Los caminos que hoy recorremos tienen miles de años de historia.',
      'Llegar al Galán requiere una travesía por la Puna que es en sí misma una experiencia: campos de piedra pómez, salares, vicuñas en estado salvaje, y un cielo que de noche muestra la Vía Láctea como en pocos lugares del mundo.',
      'En nuestra experiencia Mallku Experience 4x4 recorremos esta región durante 4 días, combinando la geología extrema del Galán con sitios arqueológicos como el Shincal de Quimivil y las ruinas de Antofagasta de la Sierra. Es un viaje para quienes buscan lo extraordinario.'
    ],
    fecha: '2024-03-10',
    categoria: 'Naturaleza',
    autor: 'Equipo Mallku',
    tiempoLectura: '5 min',
    imagen: '/images/Volcan Galan 2.webp'
  },
  {
    slug: 'campo-piedra-pomez-paisaje-otro-planeta',
    titulo: 'Campo de Piedra Pómez: un paisaje de otro planeta',
    excerpt: 'Formaciones blancas talladas por el viento durante miles de años crean un laberinto surreal en plena Puna catamarqueña. Cómo llegar, qué ver y por qué no se parece a nada que hayas visto.',
    contenido: [
      'Hay lugares que desafían la noción de lo que esperamos encontrar en la Tierra. El Campo de Piedra Pómez, en la Puna de Catamarca, es uno de ellos. Un mar de formaciones blancas y grises se extiende por kilómetros, tallado durante milenios por el viento y la erosión en formas que parecen esculturas abstractas.',
      'La piedra pómez que da nombre al lugar es el resultado de erupciones volcánicas antiguas. El material expulsado se depositó en capas que luego el viento fue modelando con paciencia infinita. El resultado es un laberinto natural de torres, arcos y cavidades que cambian de color según la hora del día: blanco enceguecedor al mediodía, dorado al atardecer, azulado bajo la luna.',
      'El campo se ubica a unos 3.000 metros de altura, cerca de la localidad de El Peñón, en el departamento de Antofagasta de la Sierra. El acceso requiere vehículo 4x4 y cierta planificación, lo que lo mantiene alejado del turismo masivo. Quienes llegan suelen tener el paisaje para ellos solos.',
      'Caminar entre las formaciones es una experiencia sensorial intensa. El silencio es absoluto, roto solo por el viento. La luz rebota en las superficies porosas creando sombras y texturas que cambian minuto a minuto. Los fotógrafos encuentran aquí un paraíso, pero ninguna foto captura realmente la escala y la soledad del lugar.',
      'A pocos kilómetros del Campo de Piedra Pómez se encuentran otros paisajes igualmente extraordinarios: las Dunas de Tatón, el Salar de Antofalla, y las lagunas altoandinas donde los flamencos se alimentan. La Puna catamarqueña es una sucesión de paisajes extremos que no tiene equivalente en el país.',
      'Visitamos el Campo de Piedra Pómez como parte de nuestra experiencia 4x4 por la Puna. No es un lugar para apurar: se necesita tiempo para recorrerlo, sentirlo y entender la escala de lo que la naturaleza puede crear con piedra, viento y millones de años.'
    ],
    fecha: '2024-03-25',
    categoria: 'Naturaleza',
    autor: 'Equipo Mallku',
    tiempoLectura: '5 min',
    imagen: '/images/Campo Piedra Pomez.jpg'
  },
  {
    slug: 'shincal-quimivil-capital-inca-del-sur',
    titulo: 'El Shincal de Quimivil: la capital inca del sur',
    excerpt: 'En Catamarca se encuentra el centro administrativo inca más austral del Tawantinsuyu. El Shincal fue la capital del sur del imperio, y sus ruinas cuentan una historia que pocos conocen.',
    contenido: [
      'Cuando pensamos en los incas, solemos imaginar Machu Picchu o Cusco. Pero el imperio inca, el Tawantinsuyu, se extendía mucho más al sur de lo que la mayoría supone. En lo que hoy es la provincia de Catamarca, los incas construyeron un centro administrativo y ceremonial de primer nivel: El Shincal de Quimivil.',
      'El Shincal funcionó como capital del extremo sur del imperio entre los siglos XV y XVI. No era un simple puesto de avanzada: tenía una plaza central (aukaipata) de 175 por 175 metros, dos plataformas ceremoniales (ushnus), un complejo sistema de canales, almacenes (qollqas) y residencias para funcionarios imperiales.',
      'Lo que hace especial al Shincal es su estado de conservación y la claridad con que se lee la planificación inca. Los arqueólogos pudieron reconstruir la lógica del asentamiento: dónde se celebraban las ceremonias, dónde se almacenaban los tributos, cómo se organizaba la vida cotidiana de quienes administraban esta región del imperio.',
      'Los incas no llegaron al NOA como conquistadores brutales. Su estrategia fue más sutil: incorporaron a los pueblos locales mediante alianzas, intercambios y, cuando fue necesario, presión militar. Los diaguitas que habitaban la zona mantuvieron muchas de sus costumbres pero adoptaron elementos incas en su organización política y ceremonial.',
      'Las excavaciones en el Shincal han revelado cerámicas de origen cusqueño, herramientas de bronce, restos de alimentos traídos desde grandes distancias, y evidencias de las fiestas rituales que los incas organizaban para consolidar alianzas con los pueblos locales. El alcohol de maíz (chicha) era central en estas ceremonias.',
      'Hoy el Shincal es Monumento Histórico Nacional y uno de los sitios arqueológicos más importantes de Argentina. En nuestra experiencia 4x4 lo visitamos con interpretación especializada, explicando no solo qué se ve sino qué significaba cada estructura en el contexto del imperio más grande de la América precolombina.'
    ],
    fecha: '2024-04-05',
    categoria: 'Arqueología',
    autor: 'Equipo Mallku',
    tiempoLectura: '6 min',
    imagen: '/images/Shincal 1.jpg'
  },
  {
    slug: 'mejor-epoca-visitar-noa-guia-mes-a-mes',
    titulo: 'Mejor época para visitar el NOA: guía mes a mes',
    excerpt: 'El Noroeste Argentino tiene climas y paisajes que cambian radicalmente según la estación. Esta guía te ayuda a elegir el mejor momento para tu viaje según qué querés ver y hacer.',
    contenido: [
      'El NOA no es un destino de temporada única. Cada estación ofrece una experiencia diferente, y elegir bien el momento del viaje puede hacer una diferencia enorme. Esta guía cubre mes a mes lo que podés esperar en términos de clima, paisaje y condiciones de viaje.',
      'MARZO A MAYO (otoño): La mejor época para muchos. Las lluvias del verano terminaron, los valles están verdes y los ríos llevan agua. Las temperaturas son agradables: 15-25°C en los valles, más frías en altura. Los sitios arqueológicos están en su mejor momento visual, con vegetación que enmarca las ruinas. Los caminos de la Puna están secos y accesibles.',
      'JUNIO A AGOSTO (invierno): Días secos y cielos despejados, ideales para fotografía. Pero las noches son frías, especialmente en altura (puede llegar a -10°C en la Puna). Los valles bajos mantienen temperaturas agradables durante el día (15-20°C). Es temporada baja, lo que significa menos turistas y más tranquilidad en los sitios. Ideal para quienes buscan soledad y cielos nocturnos espectaculares.',
      'SEPTIEMBRE A NOVIEMBRE (primavera): El NOA se despierta. Los árboles florecen, los cactus se llenan de color, y las temperaturas suben gradualmente. Es un momento excelente para las yungas (Ibatín, Quebrada del Río Los Sosa) porque la selva está en plena actividad. Los pasos de montaña se abren después del invierno.',
      'DICIEMBRE A FEBRERO (verano): La temporada de lluvias. Los paisajes son verdes y exuberantes, pero las lluvias de la tarde pueden complicar caminos y rutas. La Puna puede tener caminos cortados. Los valles bajos son calurosos (30-35°C). Si bien es temporada alta de turismo, no es necesariamente la mejor para excursiones arqueológicas por el calor y las lluvias.',
      'NUESTRA RECOMENDACIÓN: Para excursiones de día (Quilmes, Tafí, Ibatín), la mejor época es marzo-mayo y septiembre-noviembre. Para la experiencia 4x4 en la Puna, abril-octubre ofrece las mejores condiciones de camino y clima. Evitá diciembre-febrero para la Puna: las lluvias pueden hacer intransitables los caminos.',
      'Sea cual sea la época que elijas, nuestras excursiones se adaptan a las condiciones. Y si hay pronóstico de mal tiempo, reprogramamos sin cargo. Tu seguridad siempre es prioridad.'
    ],
    fecha: '2024-04-20',
    categoria: 'Guías',
    autor: 'Equipo Mallku',
    tiempoLectura: '6 min',
    imagen: '/images/Infiernillo.jpg'
  },
  {
    slug: 'diaguitas-pueblos-que-dieron-forma-al-noa',
    titulo: 'Los Diaguitas: pueblos que dieron forma al NOA',
    excerpt: 'Antes de los incas, antes de los españoles, los Diaguitas habitaron el noroeste argentino durante siglos. Su organización, su arte y su resistencia moldearon la región que hoy recorremos.',
    contenido: [
      'Cuando hablamos de los Diaguitas no hablamos de un solo pueblo sino de una confederación de naciones que compartían lengua (el cacán), territorio y ciertos rasgos culturales. Quilmes, Amaichas, Pacciocas, Tolombones, Yocaviles: cada grupo tenía su identidad, su territorio y sus líderes, pero frente a amenazas externas podían aliarse en una fuerza considerable.',
      'Los Diaguitas habitaron los Valles Calchaquíes y zonas aledañas desde aproximadamente el siglo IX hasta la conquista española en el siglo XVII. Eran agricultores sofisticados que desarrollaron sistemas de riego por canales, cultivaban maíz, zapallo, poroto y quinoa, y complementaban su dieta con la caza de guanacos y la recolección de algarroba.',
      'Su organización política era descentralizada: cada comunidad tenía su curaca (jefe) y su territorio. No había un poder central como en el imperio inca. Esta estructura les daba flexibilidad pero también les dificultaba unirse frente a enemigos comunes. Cuando los incas llegaron al NOA en el siglo XV, algunos pueblos diaguitas resistieron y otros negociaron.',
      'El arte diaguita es una de sus herencias más visibles. Las urnas funerarias santamarianas, con sus diseños geométricos y figuras antropomorfas, son piezas de una sofisticación estética notable. Cada museo del NOA tiene ejemplares, pero verlas en contexto, en los valles donde fueron creadas, les da otro significado.',
      'La resistencia diaguita frente a la conquista española fue la más prolongada de la Argentina. Las Guerras Calchaquíes (1562-1667) duraron más de un siglo e involucraron alianzas, traiciones, batallas y diplomacia. Los Quilmes, uno de los pueblos diaguitas, fueron los últimos en caer. Su castigo fue ejemplar: fueron deportados a pie hasta Buenos Aires.',
      'Hoy los descendientes diaguitas siguen presentes en el NOA. Comunidades en Tucumán, Catamarca y Salta mantienen viva su identidad y luchan por el reconocimiento de sus derechos territoriales. El paisaje que recorremos en nuestras excursiones fue moldeado por estos pueblos durante siglos: los caminos, los sitios, las terrazas de cultivo, todo habla de una presencia que no se borró.',
      'En nuestras excursiones no contamos la historia diaguita como algo del pasado. La contamos como lo que es: la base sobre la que se construyó todo lo que vino después en el NOA.'
    ],
    fecha: '2024-05-10',
    categoria: 'Historia',
    autor: 'Equipo Mallku',
    tiempoLectura: '6 min',
    imagen: '/images/Quilmes 2.jpg'
  },
  {
    slug: 'que-es-turismo-arqueologico-por-que-elegirlo',
    titulo: 'Qué es el turismo arqueológico y por qué elegirlo',
    excerpt: 'No es un tour convencional. El turismo arqueológico combina viaje, ciencia y narrativa para transformar la forma en que entendemos los lugares que visitamos.',
    contenido: [
      'El turismo arqueológico es una forma de viajar que pone el conocimiento en el centro de la experiencia. No se trata de ver ruinas y sacar fotos: se trata de entender qué significaban esos lugares, quiénes los habitaron, cómo vivían y qué podemos aprender de ellos. Es turismo con profundidad.',
      'La diferencia con el turismo convencional es el nivel de interpretación. Un tour estándar te lleva a un sitio arqueológico, te muestra las estructuras y te da datos básicos. Una excursión arqueológica te explica el contexto: por qué se construyó así, qué decisiones políticas y ambientales influyeron, cómo encaja en la historia regional, qué debates existen entre los investigadores.',
      'Para que funcione, el turismo arqueológico necesita guías con formación específica. No alcanza con saber la historia de memoria: hay que saber leer un paisaje, interpretar una estructura, conectar hallazgos con procesos más amplios. Es la diferencia entre repetir información y generar comprensión.',
      'Otro elemento central es el ritmo. Las excursiones arqueológicas no se apuran. Necesitan tiempo para recorrer, observar, preguntar. Los grupos son reducidos justamente para permitir ese intercambio. No es un bus con 40 personas y un micrófono: es una conversación en el lugar donde las cosas pasaron.',
      '¿Por qué elegirlo? Porque transforma la experiencia de viaje. Después de una excursión arqueológica, el paisaje deja de ser solo paisaje. Cada cerro, cada valle, cada muro tiene una historia que ahora conocés. Es un viaje que no se olvida porque no se queda en lo superficial.',
      'En Mallku hacemos turismo arqueológico en el Noroeste Argentino, una de las regiones con mayor densidad de patrimonio arqueológico de Sudamérica. Sitios como Quilmes, los Menhires de Tafí, Ibatín o el Shincal de Quimivil son puntos de entrada a miles de años de historia que la mayoría de los argentinos desconoce.',
      'Si buscás un viaje que te deje algo más que fotos, el turismo arqueológico es para vos. Y si querés hacerlo en el NOA, estamos para acompañarte.'
    ],
    fecha: '2024-05-25',
    categoria: 'Guías',
    autor: 'Equipo Mallku',
    tiempoLectura: '6 min',
    imagen: '/images/Arqueologia.jpg'
  }
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug);
}

export function getPostsByCategoria(categoria: string): Post[] {
  return posts.filter(p => p.categoria === categoria);
}
