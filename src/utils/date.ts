/**
 * Módulo utilitario de formateo y localización de fechas para el blog y publicaciones.
 * Centraliza la lógica de Intl.DateTimeFormat con locale 'es-AR' y timeZone 'UTC' estricto
 * para garantizar determinismo tanto en builds estáticos como en visualización de posts.
 */

export type DateInput = Date | string | number | null | undefined;

export interface FormatDateOptions {
  /** Estilo de visualización: 'short' ("12 oct 2020") o 'long' ("12 de octubre de 2020"). Por defecto: 'short'. */
  style?: 'short' | 'long';
  /** Texto fallback devuelto si la fecha es nula o inválida. Por defecto: 'Fecha no disponible'. */
  fallback?: string;
}

export const DEFAULT_LOCALE = 'es-AR';
export const DEFAULT_TIMEZONE = 'UTC';
export const DEFAULT_FALLBACK = 'Fecha no disponible';

const shortDateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: DEFAULT_TIMEZONE,
});

const longDateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: DEFAULT_TIMEZONE,
});

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
 * Formatea una fecha según el estilo indicado ('short' o 'long') en español de Argentina (es-AR) con timezone UTC.
 * Si la entrada es inválida o nula, retorna el fallback seguro sin lanzar excepciones.
 */
export function formatDate(
  input: DateInput,
  options: FormatDateOptions = {}
): string {
  const { style = 'short', fallback = DEFAULT_FALLBACK } = options;
  const date = toValidDate(input);

  if (!date) {
    return fallback;
  }

  try {
    if (style === 'long') {
      return longDateFormatter.format(date);
    }
    return shortDateFormatter.format(date);
  } catch {
    return fallback;
  }
}

/**
 * Formato corto de fecha (ej. "12 oct 2020").
 */
export function formatDateShort(
  input: DateInput,
  fallback: string = DEFAULT_FALLBACK
): string {
  return formatDate(input, { style: 'short', fallback });
}

/**
 * Formato extendido de fecha (ej. "12 de octubre de 2020").
 */
export function formatDateLong(
  input: DateInput,
  fallback: string = DEFAULT_FALLBACK
): string {
  return formatDate(input, { style: 'long', fallback });
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

