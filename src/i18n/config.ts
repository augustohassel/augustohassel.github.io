export const defaultLocale = 'es' as const;
export const locales = ['es', 'en', 'de'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  de: 'Deutsch',
};

export const localeShortLabels: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  de: 'DE',
};

