import { es } from './ui/es';
import { en } from './ui/en';
import { fr } from './ui/fr';
import { defaultLocale, locales } from './locales';
import type { Locale } from './locales';
import type { TranslationKey } from './ui/es';

const translations: Record<Locale, Record<string, string>> = { es, en, fr };

/**
 * Extract locale from a URL pathname.
 * /en/about → 'en', /fr/excursions → 'fr', /about → 'es' (default)
 */
export function getLocaleFromUrl(url: URL): Locale {
  const [, segment] = url.pathname.split('/');
  if (locales.includes(segment as Locale) && segment !== defaultLocale) {
    return segment as Locale;
  }
  return defaultLocale;
}

/**
 * Get a translation function bound to a specific locale.
 * Usage in .astro: const t = useTranslations(locale);
 *                  t('nav.home') → 'Home'
 */
export function useTranslations(locale: Locale) {
  return function t(key: TranslationKey): string {
    return translations[locale]?.[key] ?? translations[defaultLocale][key] ?? key;
  };
}

/**
 * Build a localized path.
 * getLocalePath('/excursiones', 'en') → '/en/excursiones'
 * getLocalePath('/excursiones', 'es') → '/excursiones'  (default, no prefix)
 */
export function getLocalePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean}`;
}

/**
 * Get the equivalent path in another locale (for language switcher).
 * Strips the current locale prefix and adds the target one.
 */
export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  // Remove any existing locale prefix
  let stripped = currentPath;
  for (const loc of locales) {
    if (loc !== defaultLocale && currentPath.startsWith(`/${loc}/`)) {
      stripped = currentPath.slice(loc.length + 1);
      break;
    }
    if (loc !== defaultLocale && currentPath === `/${loc}`) {
      stripped = '/';
      break;
    }
  }
  if (targetLocale === defaultLocale) return stripped;
  return `/${targetLocale}${stripped}`;
}

export { locales, defaultLocale };
export type { Locale, TranslationKey };
