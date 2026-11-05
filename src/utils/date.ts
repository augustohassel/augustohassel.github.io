/**
 * Módulo utilitario de formateo y localización de fechas para el blog y publicaciones.
 * Centraliza la lógica de Intl.DateTimeFormat con locale 'es-AR' y timeZone 'UTC' estricto
 * para garantizar determinismo tanto en builds estáticos como en visualización de posts.
 */

export type DateInput = Date | string | number | null | undefined;

export interface FormatDateOptions {
  /** Estilo de visualización: 'short' ("12 oct 2020") o 'long' ("12 de octubre de 2020"). Por defecto: 'short'. */
  style?: 'short' | 'long';
  /** Idioma o locale ('es', 'en', 'de', 'es-AR', 'en-US', 'de-DE'). Por defecto: 'es-AR'. */
  locale?: string;
  /** Texto fallback devuelto si la fecha es nula o inválida. Por defecto se adapta al idioma. */
  fallback?: string;
}

export const DEFAULT_LOCALE = 'es-AR';
export const DEFAULT_TIMEZONE = 'UTC';
export const DEFAULT_FALLBACK = 'Fecha no disponible';

export const LOCALE_MAP: Record<string, string> = {
  es: 'es-AR',
  'es-AR': 'es-AR',
  en: 'en-US',
  'en-US': 'en-US',
  de: 'de-DE',
  'de-DE': 'de-DE',
};

export const DEFAULT_FALLBACKS: Record<string, string> = {
  es: 'Fecha no disponible',
  'es-AR': 'Fecha no disponible',
  en: 'Date not available',
  'en-US': 'Date not available',
  de: 'Datum nicht verfügbar',
  'de-DE': 'Datum nicht verfügbar',
};

/**
 * Normaliza y valida una entrada de fecha.
 * Retorna una instancia válida de `Date` o `null` si la entrada es nula, vacía o inválida (NaN).
 */
export function toValidDate(input: DateInput): Date | null {
  if (input === null || input === undefined || input === '') {
    return null;
  }

  const date = input instanceof Date ? input : new Date(input);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

/**
 * Formatea una fecha según el estilo indicado ('short' o 'long') con el locale solicitado (o es-AR por defecto) y timezone UTC.
 * Si la entrada es inválida o nula, retorna el fallback seguro sin lanzar excepciones.
 */
export function formatDate(
  input: DateInput,
  options: FormatDateOptions = {}
): string {
  const { style = 'short', locale = DEFAULT_LOCALE, fallback } = options;
  const resolvedLocale = LOCALE_MAP[locale] ?? locale ?? DEFAULT_LOCALE;
  const langKey = resolvedLocale.split('-')[0];
  const autoFallback = fallback ?? DEFAULT_FALLBACKS[resolvedLocale] ?? DEFAULT_FALLBACKS[langKey] ?? DEFAULT_FALLBACK;

  const date = toValidDate(input);

  if (!date) {
    return autoFallback;
  }

  try {
    const formatter = new Intl.DateTimeFormat(resolvedLocale, {
      year: 'numeric',
      month: style === 'long' ? 'long' : 'short',
      day: 'numeric',
      timeZone: DEFAULT_TIMEZONE,
    });
    return formatter.format(date);
  } catch {
    return autoFallback;
  }
}

/**
 * Formato corto de fecha (ej. "12 oct 2020", "Oct 12, 2020", "12. Okt. 2020").
 */
export function formatDateShort(
  input: DateInput,
  locale: string = DEFAULT_LOCALE,
  fallback?: string
): string {
  return formatDate(input, { style: 'short', locale, fallback });
}

/**
 * Formato extendido de fecha (ej. "12 de octubre de 2020", "October 12, 2020", "12. Oktober 2020").
 */
export function formatDateLong(
  input: DateInput,
  locale: string = DEFAULT_LOCALE,
  fallback?: string
): string {
  return formatDate(input, { style: 'long', locale, fallback });
}

/**
 * Retorna la representación ISO (YYYY-MM-DDTHH:mm:ss.sssZ) segura para el atributo `datetime` de elementos `<time>`.
 * Si la fecha es inválida o nula, retorna el fallback (cadena vacía por defecto) sin fallar el build.
 */
export function toISODateString(
  input: DateInput,
  fallback: string = ''
): string {
  const date = toValidDate(input);

  if (!date) {
    return fallback;
  }

  try {
    return date.toISOString();
  } catch {
    return fallback;
  }
}

