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

export async function getFechas(locale: Locale): Promise<FechaSalida[]> {
  switch (locale) {
    case 'en': return (await import('./fechas.en')).fechasSalidas;
    case 'fr': return (await import('./fechas.fr')).fechasSalidas;
    default: return (await import('./fechas')).fechasSalidas;
  }
}
