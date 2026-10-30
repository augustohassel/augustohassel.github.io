export interface PressMention {
  title: string;
  media: string;
  date: string;
  year: number;
  url: string;
  excerpt: string;
  category: 'prensa' | 'autor';
  badge?: string;
}

export const pressMentions: PressMention[] = [
  {
    title: "Adiós Parra: Lecciones aprendidas",
    media: "LinkedIn Pulse",
    date: "Diciembre 2023",
    year: 2023,
    url: "https://www.linkedin.com/pulse/adi%C3%B3s-parra-lecciones-aprendidas-augusto-hassel-t3mxf/",
    excerpt: "Reflexión en primera persona sobre el ciclo completo de Parra Payments: desde la fundación y el crecimiento en pandemia hasta su venta, compartiendo aprendizajes directos en tecnología, liderazgo de producto y resiliencia.",
    category: "autor",
    badge: "Founder Story"
  },
  {
    title: "Manual de supervivencia gastronómica",
    media: "La Nación",
    date: "Enero 2021",
    year: 2021,
    url: "https://www.lanacion.com.ar/economia/negocios/manual-supervivencia-gastronomica-nid2571216/",
    excerpt: "Perfil de Augusto Hassel y la génesis de Parra Payments: cómo la optimización de filas y pagos en una cervecería porteña derivó en una solución digital de autogestión y cobro QR para el sector gastronómico.",
    category: "prensa",
    badge: "Economía & Negocios"
  },
  {
    title: "La gastrotech Parra Payments se alía para desembarcar en Centroamérica",
    media: "Forbes Argentina",
    date: "Septiembre 2021",
    year: 2021,
    url: "https://www.forbesargentina.com/negocios/la-gastrotech-parra-payments-se-alia-teip-desembarcar-centroamerica-n8387",
    excerpt: "Cobertura de Forbes sobre el modelo de negocio SaaS de Parra, la ronda de inversión pre-seed y su estrategia de expansión internacional para exportar tecnología financiera y pedidos sin contacto.",
    category: "prensa",
    badge: "Expansión Internacional"
  },
  {
    title: "Parra Payments se une a Eastern Point Trust Company para acelerar pagos digitales",
    media: "iProUP",
    date: "Marzo 2022",
    year: 2022,
    url: "https://www.iproup.com/innovacion/29517-parra-payments-gastrotech-se-une-a-nemi-para-crecer",
    excerpt: "Reportaje sobre la consolidación de Parra dentro del ecosistema de software institucional de Eastern Point Trust Company (NEMI), impulsando soluciones de infraestructura fintech en la región.",
    category: "prensa",
    badge: "Fintech & M&A"
  }
];
