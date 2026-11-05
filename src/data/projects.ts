import type { Locale } from '../i18n/config';

export type ProjectCategory = 'active' | 'startups' | 'historical';

export interface ProjectLink {
  label: string;
  url: string;
  type: 'demo' | 'github' | 'article' | 'youtube' | 'external';
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  tags: string[];
  links?: ProjectLink[];
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'surface' | 'outline';
  };
}

export interface CategoryInfo {
  id: ProjectCategory;
  title: string;
  description: string;
  badgeText: string;
}

interface LocalizedCategoryInfo {
  id: ProjectCategory;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  badgeText: Record<Locale, string>;
}

interface LocalizedProject {
  id: string;
  title: string;
  category: ProjectCategory;
  description: Record<Locale, string>;
  tags: string[];
  links?: {
    label: Record<Locale, string>;
    url: string;
    type: ProjectLink['type'];
  }[];
  badge?: {
    text: Record<Locale, string>;
    variant?: 'primary' | 'secondary' | 'surface' | 'outline';
  };
}

const localizedCategories: LocalizedCategoryInfo[] = [
  {
    id: 'active',
    title: {
      es: 'Proyectos Activos 2026',
      en: 'Active Projects 2026',
      de: 'Aktive Projekte 2026',
    },
    description: {
      es: 'Aplicaciones web progresivas (PWA) offline-first y herramientas modernas de software con privacidad local absoluta y zero-backend.',
      en: 'Offline-first progressive web apps (PWA) and modern software tools with absolute local privacy and zero-backend.',
      de: 'Offline-First Progressive Web Apps (PWA) und moderne Software-Tools mit absoluter lokaler Privatsphäre und Zero-Backend.',
    },
    badgeText: {
      es: 'En producción y desarrollo activo',
      en: 'In production & active development',
      de: 'In Produktion & aktiver Entwicklung',
    },
  },
  {
    id: 'startups',
    title: {
      es: 'Startups & Emprendimientos',
      en: 'Startups & Ventures',
      de: 'Start-ups & Unternehmungen',
    },
    description: {
      es: 'Compañías cofundadas e iniciativas empresariales en tecnología financiera, pagos digitales y análisis cuantitativo de mercados.',
      en: 'Co-founded companies and entrepreneurial initiatives in fintech, digital payments, and quantitative market analysis.',
      de: 'Mitgegründete Unternehmen und unternehmerische Initiativen in Finanztechnologie, digitalen Zahlungen und quantitativer Marktanalyse.',
    },
    badgeText: {
      es: 'Trayectoria fundacional',
      en: 'Foundational track record',
      de: 'Gründer-Erfahrung',
    },
  },
  {
    id: 'historical',
    title: {
      es: 'Archivo Histórico & Medios',
      en: 'Historical Archive & Media',
      de: 'Historisches Archiv & Medien',
    },
    description: {
      es: 'Bibliotecas de código abierto en R para mercados bursátiles y divulgación audiovisual sobre tecnología y finanzas.',
      en: 'Open-source R packages for capital markets and audiovisual content on technology and finance.',
      de: 'Open-Source-R-Pakete für Kapitalmärkte und audiovisuelle Wissensvermittlung über Technologie und Finanzen.',
    },
    badgeText: {
      es: 'Open Source & Contenido',
      en: 'Open Source & Content',
      de: 'Open Source & Medien',
    },
  },
];

const localizedProjects: LocalizedProject[] = [
  // 1. Proyectos Activos 2026
  {
    id: 'mibarcito',
    title: 'MiBarcito',
    category: 'active',
    description: {
      es: 'Gestión inteligente de stock en despensa, recetario dinámico y asistencia de IA multimodal con privacidad local.',
      en: 'Smart pantry stock management, dynamic recipe book, and multimodal AI assistance with local privacy.',
      de: 'Intelligente Vorratsverwaltung, dynamisches Rezeptbuch und multimodale KI-Unterstützung mit lokaler Privatsphäre.',
    },
    tags: ['React 19', 'TypeScript', 'PWA', 'Tailwind CSS', 'IndexedDB', 'IA Multimodal'],
    links: [
      {
        label: {
          es: 'Probar Web App',
          en: 'Try Web App',
          de: 'Web-App testen',
        },
        url: 'https://barcito.hasselpunk.com',
        type: 'demo',
      },
      {
        label: {
          es: 'Repositorio',
          en: 'Repository',
          de: 'Repository',
        },
        url: 'https://github.com/augustohassel/MiBarcito',
        type: 'github',
      },
    ],
  },
  {
    id: 'split',
    title: 'Split',
    category: 'active',
    description: {
      es: 'Aplicación Mobile-First y PWA para nadadores: registro de marcas, parciales (splits), cálculo de Puntos FINA (World Aquatics) y evolución hacia objetivos con 100% privacidad local.',
      en: 'Mobile-first PWA for competitive swimmers: timing records, splits, FINA (World Aquatics) points calculator, and progress tracking with 100% local privacy.',
      de: 'Mobile-First PWA für Schwimmer: Erfassung von Bestzeiten, Zwischenzeiten (Splits), FINA-Punkteberechnung (World Aquatics) und Zielverfolgung mit 100% lokaler Privatsphäre.',
    },
    tags: ['React 18', 'TypeScript', 'PWA', 'IndexedDB', 'Recharts', 'Tailwind CSS'],
    links: [
      {
        label: {
          es: 'Probar Web App',
          en: 'Try Web App',
          de: 'Web-App testen',
        },
        url: 'https://split.hasselpunk.com',
        type: 'demo',
      },
      {
        label: {
          es: 'Repositorio',
          en: 'Repository',
          de: 'Repository',
        },
        url: 'https://github.com/augustohassel/Split',
        type: 'github',
      },
    ],
  },
  {
    id: 'antropopopo',
    title: 'AntropoPopo',
    category: 'active',
    description: {
      es: 'Aplicación Mobile-First y PWA para Antropometría ISAK Nivel 1, Composición Corporal y Somatotipo de Heath & Carter con Zero-Backend y enlaces cifrados con AES-GCM.',
      en: 'Mobile-first PWA for ISAK Level 1 anthropometry, body composition, and Heath & Carter somatotype analysis with zero-backend and AES-GCM encrypted links.',
      de: 'Mobile-First PWA für ISAK Level 1 Anthropometrie, Körperzusammensetzung und Heath & Carter Somatotyp mit Zero-Backend und AES-GCM-verschlüsselten Links.',
    },
    tags: ['React 18', 'TypeScript', 'PWA', 'IndexedDB', 'Tailwind CSS', 'AES-GCM'],
    links: [
      {
        label: {
          es: 'Probar Web App',
          en: 'Try Web App',
          de: 'Web-App testen',
        },
        url: 'https://antropo.hasselpunk.com/',
        type: 'demo',
      },
      {
        label: {
          es: 'Repositorio',
          en: 'Repository',
          de: 'Repository',
        },
        url: 'https://github.com/augustohassel/AntropoPopo',
        type: 'github',
      },
    ],
  },
  {
    id: 'ratingsapp',
    title: 'RatingsApp',
    category: 'active',
    description: {
      es: 'Aplicación Mobile-First y PWA para auto-evaluación y seguimiento ponderado dinámico de criterios vitales y laborales con privacidad absoluta en el dispositivo.',
      en: 'Mobile-first PWA for self-assessment and dynamic weighted tracking of life and work criteria with complete on-device privacy.',
      de: 'Mobile-First PWA zur Selbsteinschätzung und dynamisch gewichteten Verfolgung von Lebens- und Arbeitskriterien mit vollständiger Privatsphäre auf dem Gerät.',
    },
    tags: ['React 18', 'TypeScript', 'PWA', 'IndexedDB', 'Recharts', 'Tailwind CSS'],
    links: [
      {
        label: {
          es: 'Probar Web App',
          en: 'Try Web App',
          de: 'Web-App testen',
        },
        url: 'https://ratings.hasselpunk.com/',
        type: 'demo',
      },
      {
        label: {
          es: 'Repositorio',
          en: 'Repository',
          de: 'Repository',
        },
        url: 'https://github.com/augustohassel/RatingsApp',
        type: 'github',
      },
    ],
  },
  {
    id: 'listita',
    title: 'Listita',
    category: 'active',
    description: {
      es: 'Herramienta de productividad para crear y gestionar listados personalizados (vinos, bares, comidas) con atributos propios, notas y rankings personales manuales.',
      en: 'Productivity tool to create and manage custom curated lists (wines, bars, food) with custom attributes, notes, and manual personal rankings.',
      de: 'Produktivitätswerkzeug zum Erstellen und Verwalten individueller Listen (Weine, Bars, Restaurants) mit eigenen Attributen, Notizen und persönlichen manuellen Rankings.',
    },
    tags: ['React', 'TypeScript', 'Vite', 'IndexedDB', 'Dexie.js'],
    links: [
      {
        label: {
          es: 'Probar Web App',
          en: 'Try Web App',
          de: 'Web-App testen',
        },
        url: 'https://listita.hasselpunk.com',
        type: 'demo',
      },
      {
        label: {
          es: 'Repositorio',
          en: 'Repository',
          de: 'Repository',
        },
        url: 'https://github.com/augustohassel/Listita',
        type: 'github',
      },
    ],
  },

  // 2. Startups & Emprendimientos
  {
    id: 'parra-payments',
    title: 'Parra Payments',
    category: 'startups',
    description: {
      es: 'Plataforma de software y pagos QR para el sector gastronómico fundada en post-pandemia. Transitó inversión de DC Ventures y su posterior adquisición y fusión con Eastern Point Trust Company (NEMI).',
      en: 'Software and QR payment platform for the hospitality and restaurant industry founded post-pandemic. Secured investment from DC Ventures and was later acquired and merged with Eastern Point Trust Company (NEMI).',
      de: 'Software- und QR-Zahlungsplattform für die Gastronomie, gegründet in der Post-Pandemie-Phase. Durchlief Investition von DC Ventures und anschließende Übernahme sowie Fusion mit Eastern Point Trust Company (NEMI).',
    },
    tags: ['Gastrotech', 'QR Payments', 'FinTech', 'M&A'],
    badge: {
      text: {
        es: 'Adquirida por NEMI',
        en: 'Acquired by NEMI',
        de: 'Von NEMI übernommen',
      },
      variant: 'outline',
    },
    links: [
      {
        label: {
          es: 'Leer lecciones aprendidas',
          en: 'Read lessons learned',
          de: 'Lektionen lesen',
        },
        url: 'https://www.linkedin.com/pulse/adi%C3%B3s-parra-lecciones-aprendidas-augusto-hassel-t3mxf/',
        type: 'article',
      },
    ],
  },
  {
    id: 'puerto-finanzas',
    title: 'Puerto Finanzas',
    category: 'startups',
    description: {
      es: 'Red social financiera y plataforma comunitaria pionera en Argentina para el análisis de mercados de capitales mediante modelos de procesamiento de lenguaje natural (NLP) y ML.',
      en: 'Pioneering financial social network and community platform in Argentina for capital markets analysis utilizing natural language processing (NLP) and ML models.',
      de: 'Pionierhaftes soziales Finanznetzwerk und Community-Plattform in Argentinien zur Kapitalmarktanalyse mittels Modellen zur natürlichen Sprachverarbeitung (NLP) und ML.',
    },
    tags: ['Finanzas Cuantitativas', 'NLP', 'Machine Learning', 'Comunidad Bursátil'],
    badge: {
      text: {
        es: 'Startup Histórica',
        en: 'Historical Startup',
        de: 'Historisches Start-up',
      },
      variant: 'outline',
    },
    links: [],
  },

  // 3. Archivo Histórico & Medios
  {
    id: 'tecnoemprendedores',
    title: 'Tecnoemprendedores',
    category: 'historical',
    description: {
      es: 'Serie audiovisual y canal de divulgación sobre innovación, tecnología aplicada, finanzas cuantitativas y cultura emprendedora.',
      en: 'Audiovisual series and educational channel covering innovation, applied technology, quantitative finance, and entrepreneurial culture.',
      de: 'Audiovisuelle Serie und Bildungskanal über Innovation, angewandte Technologie, quantitative Finanzen und Gründerkultur.',
    },
    tags: ['YouTube', 'Audiovisual', 'Divulgación Tech', 'Finanzas'],
    links: [
      {
        label: {
          es: 'Ver Canal de YouTube',
          en: 'Watch YouTube Channel',
          de: 'YouTube-Kanal ansehen',
        },
        url: 'https://www.youtube.com/@AugustoHassel',
        type: 'youtube',
      },
    ],
  },
  {
    id: 'rrofex',
    title: 'rRofex',
    category: 'historical',
    description: {
      es: 'Paquete y conector oficial en lenguaje R para interactuar con la API REST y WebSockets de la plataforma de negociación de Matba Rofex, publicado oficialmente en CRAN.',
      en: 'Official R package and connector to interact with the Matba Rofex trading platform REST API and WebSockets, published on CRAN.',
      de: 'Offizielles R-Paket und Connector zur Interaktion mit der REST-API und den WebSockets der Matba Rofex Handelsplattform, veröffentlicht auf CRAN.',
    },
    tags: ['R', 'CRAN', 'Matba Rofex', 'Trading API', 'WebSockets'],
    links: [
      {
        label: {
          es: 'Repositorio',
          en: 'Repository',
          de: 'Repository',
        },
        url: 'https://github.com/matbarofex/rRofex',
        type: 'github',
      },
    ],
  },
  {
    id: 'acyrsa',
    title: 'acyRsa',
    category: 'historical',
    description: {
      es: 'Paquete en lenguaje R para automatizar la ingesta y consulta de datos operativos y de Back Office bursátil a través de la API de ACyRSA.',
      en: 'R package for automating ingestion and querying of brokerage operations and back office data through the ACyRSA API.',
      de: 'R-Paket zur Automatisierung des Datenabrufs und der Abfrage von Handels- und Back-Office-Daten über die ACyRSA-API.',
    },
    tags: ['R', 'API Connector', 'Back Office', 'Mercado de Capitales'],
    links: [
      {
        label: {
          es: 'Repositorio',
          en: 'Repository',
          de: 'Repository',
        },
        url: 'https://github.com/augustohassel/acyRsa',
        type: 'github',
      },
    ],
  },
];

export function getProjectCategories(locale: Locale = 'es'): CategoryInfo[] {
  const safeLocale = (['es', 'en', 'de'] as Locale[]).includes(locale) ? locale : 'es';

  return localizedCategories.map((cat) => ({
    id: cat.id,
    title: cat.title[safeLocale] ?? cat.title.es,
    description: cat.description[safeLocale] ?? cat.description.es,
    badgeText: cat.badgeText[safeLocale] ?? cat.badgeText.es,
  }));
}

export function getProjects(locale: Locale = 'es'): Project[] {
  const safeLocale = (['es', 'en', 'de'] as Locale[]).includes(locale) ? locale : 'es';

  return localizedProjects.map((project) => ({
    id: project.id,
    title: project.title,
    category: project.category,
    description: project.description[safeLocale] ?? project.description.es,
    tags: project.tags,
    links: project.links?.map((link) => ({
      label: link.label[safeLocale] ?? link.label.es,
      url: link.url,
      type: link.type,
    })),
    badge: project.badge
      ? {
          text: project.badge.text[safeLocale] ?? project.badge.text.es,
          variant: project.badge.variant,
        }
      : undefined,
  }));
}

// Compatibilidad retroactiva directa para imports no localizados
export const projectCategories = getProjectCategories('es');
export const projects = getProjects('es');
