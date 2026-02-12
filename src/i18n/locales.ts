export const locales = ['es', 'en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français'
};

export const localeHtmlLang: Record<Locale, string> = {
  es: 'es-AR',
  en: 'en',
  fr: 'fr'
};

export const localeOg: Record<Locale, string> = {
  es: 'es_AR',
  en: 'en_US',
  fr: 'fr_FR'
};
