export interface FechaSalida {
  id: string;
  excursionSlug: string;
  excursionNombre: string;
  fecha: string;
  cuposDisponibles: number;
  cuposTotales: number;
  estado: 'disponible' | 'pocos-cupos' | 'completo';
  precio: string;
}

// Generate dates for the next 3 months
const hoy = new Date();
const mesActual = hoy.getMonth();
const anioActual = hoy.getFullYear();

export const fechasSalidas: FechaSalida[] = [
  // Marzo 2024
  {
    id: 'valles-mar-09',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Arqueología en los Valles',
    fecha: '2024-03-09',
    cuposDisponibles: 4,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$120.000'
  },
  {
    id: 'colonial-mar-16',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2024-03-16',
    cuposDisponibles: 6,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$100.000'
  },
  {
    id: 'valles-mar-23',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Arqueología en los Valles',
    fecha: '2024-03-23',
    cuposDisponibles: 2,
    cuposTotales: 8,
    estado: 'pocos-cupos',
    precio: '$120.000'
  },
  {
    id: 'colonial-mar-30',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2024-03-30',
    cuposDisponibles: 8,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$100.000'
  },

  // Abril 2024
  {
    id: 'valles-abr-06',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Arqueología en los Valles',
    fecha: '2024-04-06',
    cuposDisponibles: 6,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$120.000'
  },
  {
    id: 'colonial-abr-13',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2024-04-13',
    cuposDisponibles: 0,
    cuposTotales: 8,
    estado: 'completo',
    precio: '$100.000'
  },
  {
    id: 'valles-abr-20',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Arqueología en los Valles',
    fecha: '2024-04-20',
    cuposDisponibles: 5,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$120.000'
  },
  {
    id: 'colonial-abr-27',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2024-04-27',
    cuposDisponibles: 3,
    cuposTotales: 8,
    estado: 'pocos-cupos',
    precio: '$100.000'
  },

  // Mayo 2024
  {
    id: 'valles-may-04',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Arqueología en los Valles',
    fecha: '2024-05-04',
    cuposDisponibles: 8,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$120.000'
  },
  {
    id: 'colonial-may-11',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2024-05-11',
    cuposDisponibles: 7,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$100.000'
  },
  {
    id: 'valles-may-18',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Arqueología en los Valles',
    fecha: '2024-05-18',
    cuposDisponibles: 1,
    cuposTotales: 8,
    estado: 'pocos-cupos',
    precio: '$120.000'
  },
  {
    id: 'colonial-may-25',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2024-05-25',
    cuposDisponibles: 8,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$100.000'
  }
];

export function getFechasByExcursion(slug: string): FechaSalida[] {
  return fechasSalidas.filter(f => f.excursionSlug === slug);
}

export function getFechasDisponibles(): FechaSalida[] {
  return fechasSalidas.filter(f => f.estado !== 'completo');
}

export function getFechasByMes(mes: number, anio: number): FechaSalida[] {
  return fechasSalidas.filter(f => {
    const fecha = new Date(f.fecha);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio;
  });
}
