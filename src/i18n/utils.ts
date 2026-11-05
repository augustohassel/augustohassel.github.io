import { defaultLocale, locales, type Locale } from './config';
import { ui, type UIKey } from './ui';

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isValidLocale(firstSegment) && firstSegment !== defaultLocale) {
    return firstSegment;
  }

  return defaultLocale;
}

export function useTranslations(locale: Locale = defaultLocale) {
  const safeLocale = isValidLocale(locale) ? locale : defaultLocale;

  return function t(key: UIKey, params?: Record<string, string | number>): string {
    const localeDict = ui[safeLocale] as Record<string, string>;
    const defaultDict = ui[defaultLocale] as Record<string, string>;

    let text = localeDict[key] ?? defaultDict[key] ?? key;

    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        text = text.replaceAll(`{${paramKey}}`, String(paramValue));
      }
    }

    return text;
  };
}

/**
 * Normaliza y devuelve la ruta localizada para la navegación interna.
 * Maneja de forma segura enlaces raíz (/), anclas (/#sobre-mi, #contacto)
 * y rutas que no tienen versión traducida (como /blog).
 */
export function getLocalizedPath(path: string, locale: Locale = defaultLocale): string {
  const targetLocale = isValidLocale(locale) ? locale : defaultLocale;

  // Enlaces externos o mailto no se modifican
  if (/^(https?:|\/\/|mailto:|tel:)/.test(path)) {
    return path;
  }

  // Rutas del índice de blog
  if (path === '/blog' || path === '/blog/') {
    return targetLocale === defaultLocale ? '/blog/' : `/${targetLocale}/blog/`;
  }

  // Si es un ancla pura (#sobre-mi), normalizamos a la página actual con prefijo
  let cleanPath = path.startsWith('#') ? `/${path}` : path;

  // Remover prefijo de idioma existente si lo tuviera (/en/, /de/)
  for (const l of locales) {
    if (l !== defaultLocale) {
      if (cleanPath === `/${l}` || cleanPath === `/${l}/`) {
        cleanPath = '/';
        break;
      }
      if (cleanPath.startsWith(`/${l}/`)) {
        cleanPath = cleanPath.slice(l.length + 1); // conserva la barra inicial
        break;
      }
    }
  }

  // Si el locale destino es español (defaultLocale), prefixDefaultLocale es false
  if (targetLocale === defaultLocale) {
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  }

  // Para locales secundarios ('en', 'de')
  if (cleanPath === '/' || cleanPath === '') {
    return `/${targetLocale}/`;
  }

  if (cleanPath.startsWith('/#')) {
    return `/${targetLocale}/${cleanPath.slice(1)}`;
  }

  return `/${targetLocale}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
}

/**
 * Obtiene la URL de destino al alternar de idioma desde cualquier página del sitio.
 * Soporta alternateUrls explícitas (ej. variantes de un post del blog) y aplica
 * fallbacks seguros (ej. posts que solo existen en español redirigen a /en/blog/ o /de/blog/)
 * para evitar enlaces rotos o 404s.
 */
export function getSwitchLocalePath(
  pathname: string,
  targetLocale: Locale,
  alternateUrls?: Partial<Record<Locale, string>>
): string {
  if (alternateUrls && alternateUrls[targetLocale]) {
    const url = alternateUrls[targetLocale]!;
    return url.endsWith('/') || url.includes('#') ? url : `${url}/`;
  }

  const cleanPath = pathname.replace(/\/$/, '') || '/';

  // Si está en el índice del blog
  if (cleanPath === '/blog' || cleanPath === '/en/blog' || cleanPath === '/de/blog') {
    if (targetLocale === defaultLocale) {
      return '/blog/';
    }
    return `/${targetLocale}/blog/`;
  }

  // Si está en una subpágina del blog sin traducción explícita, redirige al índice del blog
  if (
    cleanPath.startsWith('/blog/') ||
    cleanPath.startsWith('/en/blog/') ||
    cleanPath.startsWith('/de/blog/')
  ) {
    if (targetLocale === defaultLocale) {
      return '/blog/';
    }
    return `/${targetLocale}/blog/`;
  }

  // Para la raíz / landing o anclas
  if (cleanPath === '/' || cleanPath === '/en' || cleanPath === '/de') {
    return getLocalizedPath('/', targetLocale);
  }

  return getLocalizedPath(cleanPath, targetLocale);
}

