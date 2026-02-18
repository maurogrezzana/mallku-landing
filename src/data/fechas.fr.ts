import type { FechaSalida } from './fechas';

export const fechasSalidas: FechaSalida[] = [
  // Février 2026
  {
    id: 'valles-feb-14',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Archéologie dans les Vallées',
    fecha: '2026-02-14',
    cuposDisponibles: 4,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$120.000'
  },
  {
    id: 'colonial-feb-21',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2026-02-21',
    cuposDisponibles: 6,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$100.000'
  },
  {
    id: 'valles-feb-28',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Archéologie dans les Vallées',
    fecha: '2026-02-28',
    cuposDisponibles: 2,
    cuposTotales: 8,
    estado: 'pocos-cupos',
    precio: '$120.000'
  },

  // Mars 2026
  {
    id: 'colonial-mar-07',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2026-03-07',
    cuposDisponibles: 8,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$100.000'
  },
  {
    id: 'valles-mar-14',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Archéologie dans les Vallées',
    fecha: '2026-03-14',
    cuposDisponibles: 6,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$120.000'
  },
  {
    id: '4x4-mar-19',
    excursionSlug: 'mallku-experience-4x4',
    excursionNombre: 'Mallku Experience 4x4',
    fecha: '2026-03-19',
    cuposDisponibles: 4,
    cuposTotales: 6,
    estado: 'disponible',
    precio: '$1.525.000'
  },
  {
    id: 'colonial-mar-21',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2026-03-21',
    cuposDisponibles: 3,
    cuposTotales: 8,
    estado: 'pocos-cupos',
    precio: '$100.000'
  },
  {
    id: 'valles-mar-28',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Archéologie dans les Vallées',
    fecha: '2026-03-28',
    cuposDisponibles: 8,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$120.000'
  },

  // Avril 2026
  {
    id: 'colonial-abr-04',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2026-04-04',
    cuposDisponibles: 8,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$100.000'
  },
  {
    id: 'valles-abr-11',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Archéologie dans les Vallées',
    fecha: '2026-04-11',
    cuposDisponibles: 5,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$120.000'
  },
  {
    id: '4x4-abr-16',
    excursionSlug: 'mallku-experience-4x4',
    excursionNombre: 'Mallku Experience 4x4',
    fecha: '2026-04-16',
    cuposDisponibles: 6,
    cuposTotales: 6,
    estado: 'disponible',
    precio: '$1.525.000'
  },
  {
    id: 'colonial-abr-18',
    excursionSlug: 'tucuman-colonial',
    excursionNombre: 'Tucumán Colonial',
    fecha: '2026-04-18',
    cuposDisponibles: 7,
    cuposTotales: 8,
    estado: 'disponible',
    precio: '$100.000'
  },
  {
    id: 'valles-abr-25',
    excursionSlug: 'arqueologia-en-los-valles',
    excursionNombre: 'Archéologie dans les Vallées',
    fecha: '2026-04-25',
    cuposDisponibles: 1,
    cuposTotales: 8,
    estado: 'pocos-cupos',
    precio: '$120.000'
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
