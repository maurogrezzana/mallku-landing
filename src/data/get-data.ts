import type { Locale } from '../i18n/locales';
import type { Excursion } from './excursiones';
import type { ExperienciaMultiDia } from './experiencias';
import type { Post } from './posts';
import type { FechaSalida } from './fechas';

// Lazy imports to avoid loading all locales at once
export async function getExcursiones(locale: Locale): Promise<Excursion[]> {
  switch (locale) {
    case 'en': return (await import('./excursiones.en')).excursiones;
    case 'fr': return (await import('./excursiones.fr')).excursiones;
    default: return (await import('./excursiones')).excursiones;
  }
}

export async function getExcursionBySlug(slug: string, locale: Locale): Promise<Excursion | undefined> {
  const data = await getExcursiones(locale);
  return data.find(e => e.slug === slug);
}

export async function getExperiencias(locale: Locale): Promise<ExperienciaMultiDia[]> {
  switch (locale) {
    case 'en': return (await import('./experiencias.en')).experiencias;
    case 'fr': return (await import('./experiencias.fr')).experiencias;
    default: return (await import('./experiencias')).experiencias;
  }
}

export async function getExperienciaBySlug(slug: string, locale: Locale): Promise<ExperienciaMultiDia | undefined> {
  const data = await getExperiencias(locale);
  return data.find(e => e.slug === slug);
}

export async function getPosts(locale: Locale): Promise<Post[]> {
  switch (locale) {
    case 'en': return (await import('./posts.en')).posts;
    case 'fr': return (await import('./posts.fr')).posts;
    default: return (await import('./posts')).posts;
  }
}

export async function getPostBySlug(slug: string, locale: Locale): Promise<Post | undefined> {
  const data = await getPosts(locale);
  return data.find(p => p.slug === slug);
}

// Map API date response to FechaSalida format
function mapApiDate(d: any): FechaSalida {
  const precio = d.precioOverride || d.precioBase;
  const precioFormateado = precio
    ? `$${Math.round(precio / 100).toLocaleString('es-AR')}`
    : '';
  const fechaStr = typeof d.fecha === 'string'
    ? d.fecha.substring(0, 10)
    : new Date(d.fecha).toISOString().substring(0, 10);
  return {
    id: d.id,
    excursionSlug: d.excursionSlug,
    excursionNombre: d.excursionTitulo,
    fecha: fechaStr,
    cuposDisponibles: d.cuposDisponibles,
    cuposTotales: d.cuposTotales,
    estado: d.estado as FechaSalida['estado'],
    precio: precioFormateado,
  };
}

export async function getFechas(locale: Locale): Promise<FechaSalida[]> {
  // Try fetching from production API at build time for fresh calendar data
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://mallku-api.vercel.app/api/v1/calendar', {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data.data.map(mapApiDate);
      }
    }
  } catch {
    // Fall through to hardcoded data
  }
  // Fallback to hardcoded data
  switch (locale) {
    case 'en': return (await import('./fechas.en')).fechasSalidas;
    case 'fr': return (await import('./fechas.fr')).fechasSalidas;
    default: return (await import('./fechas')).fechasSalidas;
  }
}
