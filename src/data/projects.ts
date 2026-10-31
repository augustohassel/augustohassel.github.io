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

export const projectCategories: CategoryInfo[] = [
  {
    id: 'active',
    title: 'Proyectos Activos 2026',
    description: 'Aplicaciones web progresivas (PWA) offline-first y herramientas modernas de software con privacidad local absoluta y zero-backend.',
    badgeText: 'En producción y desarrollo activo',
  },
  {
    id: 'startups',
    title: 'Startups & Emprendimientos',
    description: 'Compañías cofundadas e iniciativas empresariales en tecnología financiera, pagos digitales y análisis cuantitativo de mercados.',
    badgeText: 'Trayectoria fundacional',
  },
  {
    id: 'historical',
    title: 'Archivo Histórico & Medios',
    description: 'Bibliotecas de código abierto en R para mercados bursátiles y divulgación audiovisual sobre tecnología y finanzas.',
    badgeText: 'Open Source & Contenido',
  },
];

export const projects: Project[] = [
  // 1. Proyectos Activos 2026
  {
    id: 'split',
    title: 'Split',
    category: 'active',
    description: 'Aplicación Mobile-First y PWA para nadadores: registro de marcas, parciales (splits), cálculo de Puntos FINA (World Aquatics) y evolución hacia objetivos con 100% privacidad local.',
    tags: ['React 18', 'TypeScript', 'PWA', 'IndexedDB', 'Recharts', 'Tailwind CSS'],
    links: [
      {
        label: 'Probar Web App',
        url: 'https://split.hasselpunk.com',
        type: 'demo',
      },
      {
        label: 'Repositorio',
        url: 'https://github.com/augustohassel/Split',
        type: 'github',
      },
    ],
  },
  {
    id: 'antropopopo',
    title: 'AntropoPopo',
    category: 'active',
    description: 'Aplicación Mobile-First y PWA para Antropometría ISAK Nivel 1, Composición Corporal y Somatotipo de Heath & Carter con Zero-Backend y enlaces cifrados con AES-GCM.',
    tags: ['React 18', 'TypeScript', 'PWA', 'IndexedDB', 'Tailwind CSS', 'AES-GCM'],
    links: [
      {
        label: 'Probar Web App',
        url: 'https://antropo.hasselpunk.com/',
        type: 'demo',
      },
      {
        label: 'Repositorio',
        url: 'https://github.com/augustohassel/AntropoPopo',
        type: 'github',
      },
    ],
  },
  {
    id: 'ratingsapp',
    title: 'RatingsApp',
    category: 'active',
    description: 'Aplicación Mobile-First y PWA para auto-evaluación y seguimiento ponderado dinámico de criterios vitales y laborales con privacidad absoluta en el dispositivo.',
    tags: ['React 18', 'TypeScript', 'PWA', 'IndexedDB', 'Recharts', 'Tailwind CSS'],
    links: [
      {
        label: 'Probar Web App',
        url: 'https://ratings.hasselpunk.com/',
        type: 'demo',
      },
      {
        label: 'Repositorio',
        url: 'https://github.com/augustohassel/RatingsApp',
        type: 'github',
      },
    ],
  },
  {
    id: 'listita',
    title: 'Listita',
    category: 'active',
    description: 'Herramienta de productividad para crear y gestionar listados personalizados (vinos, bares, comidas) con atributos propios, notas y rankings personales manuales.',
    tags: ['React', 'TypeScript', 'Vite', 'IndexedDB', 'Dexie.js'],
    links: [
      {
        label: 'Probar Web App',
        url: 'https://listita.hasselpunk.com',
        type: 'demo',
      },
      {
        label: 'Repositorio',
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
    description: 'Plataforma de software y pagos QR para el sector gastronómico fundada en post-pandemia. Transitó inversión de DC Ventures y su posterior adquisición y fusión con Eastern Point Trust Company (NEMI).',
    tags: ['Gastrotech', 'QR Payments', 'FinTech', 'M&A'],
    badge: {
      text: 'Adquirida por NEMI',
      variant: 'outline',
    },
    links: [
      {
        label: 'Leer lecciones aprendidas',
        url: 'https://www.linkedin.com/pulse/adi%C3%B3s-parra-lecciones-aprendidas-augusto-hassel-t3mxf/',
        type: 'article',
      },
    ],
  },
  {
    id: 'puerto-finanzas',
    title: 'Puerto Finanzas',
    category: 'startups',
    description: 'Red social financiera y plataforma comunitaria pionera en Argentina para el análisis de mercados de capitales mediante modelos de procesamiento de lenguaje natural (NLP) y ML.',
    tags: ['Finanzas Cuantitativas', 'NLP', 'Machine Learning', 'Comunidad Bursátil'],
    badge: {
      text: 'Startup Histórica',
      variant: 'outline',
    },
    links: [],
  },

  // 3. Archivo Histórico & Medios
  {
    id: 'tecnoemprendedores',
    title: 'Tecnoemprendedores',
    category: 'historical',
    description: 'Serie audiovisual y canal de divulgación sobre innovación, tecnología aplicada, finanzas cuantitativas y cultura emprendedora.',
    tags: ['YouTube', 'Audiovisual', 'Divulgación Tech', 'Finanzas'],
    links: [
      {
        label: 'Ver Canal de YouTube',
        url: 'https://www.youtube.com/@AugustoHassel',
        type: 'youtube',
      },
    ],
  },
  {
    id: 'rrofex',
    title: 'rRofex',
    category: 'historical',
    description: 'Paquete y conector oficial en lenguaje R para interactuar con la API REST y WebSockets de la plataforma de negociación de Matba Rofex, publicado oficialmente en CRAN.',
    tags: ['R', 'CRAN', 'Matba Rofex', 'Trading API', 'WebSockets'],
    links: [
      {
        label: 'Repositorio',
        url: 'https://github.com/matbarofex/rRofex',
        type: 'github',
      },
    ],
  },
  {
    id: 'acyrsa',
    title: 'acyRsa',
    category: 'historical',
    description: 'Paquete en lenguaje R para automatizar la ingesta y consulta de datos operativos y de Back Office bursátil a través de la API de ACyRSA.',
    tags: ['R', 'API Connector', 'Back Office', 'Mercado de Capitales'],
    links: [
      {
        label: 'Repositorio',
        url: 'https://github.com/augustohassel/acyRsa',
        type: 'github',
      },
    ],
  },
];

