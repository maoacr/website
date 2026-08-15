// NOTE FOR MAO: every `image` below is a deterministic placeholder
// (picsum.photos/seed/...) so it stays stable across builds until you
// swap it for real project photography/screens. Everything else is
// real content pulled from your work log — adjust freely.
//
// `featured` drives which projects render in the primary case-study
// grid vs. the secondary "More work" grid on the Projects section —
// this keeps the component free of any hardcoded slug list (Open/Closed:
// add a new project or re-feature one by editing data only, never the UI).

export type Project = {
  slug: string;
  year: string;
  featured: boolean;
  stack: string[];
  image: string;
  links?: { label: string; href: string }[];
  es: { title: string; summary: string; role: string };
  en: { title: string; summary: string; role: string };
};

export const projects: Project[] = [
  {
    slug: "quarto-roomies",
    year: "2021",
    featured: true,
    stack: ["React", "Sass", "Webpack", "Jenkins", "Git & GitHub"],
    image: "https://picsum.photos/seed/quarto-roomies/1200/900",
    links: [{ label: "Ver en Behance", href: "https://www.behance.net/gallery/107491479/Quarto" }],
    es: {
      title: "Quarto — Encuentra roomies y apartamento",
      role: "Branding + desarrollo frontend",
      summary:
        "Plataforma para buscar compañeros de apartamento y arriendos disponibles, pensada para el mercado colombiano y replicable a cualquier ciudad. Detecta la ubicación del usuario y cruza filtros y preferencias para sugerir las opciones más afines. Mao lideró el proceso creativo de marca completo además del desarrollo del front.",
    },
    en: {
      title: "Quarto — Find Roommates & Apartments",
      role: "Branding + frontend development",
      summary:
        "A platform for finding roommates and available rentals, built for the Colombian market and designed to scale to any city. It detects the user's location and cross-references filters and preferences to surface the best-matching options. Mao led the entire brand identity process in addition to front-end development.",
    },
  },
  {
    slug: "sgd-tournament-app",
    year: "2026",
    featured: true,
    stack: ["Expo SDK 54", "Supabase", "PostgreSQL", "TypeScript"],
    image: "https://picsum.photos/seed/sgd-tournament/1200/900",
    es: {
      title: "SGD — Torneos deportivos y canchas sintéticas",
      role: "Desarrollo full-stack mobile",
      summary:
        "App móvil que gestiona torneos deportivos y el agendamiento de canchas sintéticas —hoy manejado por muchos dueños vía WhatsApp, cuaderno y llamadas— dentro de una misma plataforma. Backend Supabase con esquema de 12 tablas, seguridad a nivel de fila para cinco roles (superadmin, equipo, árbitro, jugador, público) y ruteo por rol vía metadata en el JWT. En desarrollo activo (MVP), con Fusagasugá como mercado de lanzamiento.",
    },
    en: {
      title: "SGD — Tournaments & Synthetic-Field Booking",
      role: "Full-stack mobile development",
      summary:
        "A mobile app that manages sports tournaments and synthetic-field booking —today handled by most field owners via WhatsApp, notebooks and phone calls— in one platform. A Supabase backend with a 12-table schema, row-level security for five roles (superadmin, team, referee, player, public), and JWT-metadata-driven role routing. Actively in development (MVP), with Fusagasugá as the launch market.",
    },
  },
  {
    slug: "ley-de-insolvencia",
    year: "2026",
    featured: true,
    stack: ["Next.js 14", "TypeScript", "Supabase", "Resend"],
    image: "https://picsum.photos/seed/ley-insolvencia/1200/900",
    es: {
      title: "Plataforma de insolvencia para firma legal",
      role: "Arquitectura y desarrollo frontend",
      summary:
        "Landing con verificador de elegibilidad y captura automática de leads disparada en paralelo a WhatsApp, correo y Slack. Fase 2 en curso: portal de cliente, gestión documental e Índice de Ansiedad conductual.",
    },
    en: {
      title: "Insolvency Platform for a Law Firm",
      role: "Architecture & frontend development",
      summary:
        "Eligibility-checker landing page with automated lead capture fired in parallel to WhatsApp, email and Slack. Phase 2 in progress: client portal, document management and a behavioral 'Anxiety Index' feature.",
    },
  },
  {
    slug: "nova-whatsapp-bot",
    year: "2026",
    featured: true,
    stack: ["Kapso", "Google Apps Script", "WhatsApp API"],
    image: "https://picsum.photos/seed/nova-stock-bot/1200/900",
    es: {
      title: "Nova — Bot de ventas por WhatsApp con IA",
      role: "Diseño conversacional e integración",
      summary:
        "Bot de ventas por WhatsApp para una marca de accesorios LED automotrices: catálogo de 11 SKUs con tabla de compatibilidad por vehículo, webhooks para registro de pedidos y funciones serverless para consultas de catálogo.",
    },
    en: {
      title: "Nova — WhatsApp AI Sales Bot",
      role: "Conversational design & integration",
      summary:
        "WhatsApp sales bot for an automotive LED-accessories brand: an 11-SKU catalog with a vehicle compatibility table, order-registration webhooks and serverless functions for catalog queries.",
    },
  },
  {
    slug: "xauusd-trading-system",
    year: "2026",
    featured: false,
    stack: ["Pine Script v6", "MQL5", "MetaTrader 5"],
    image: "https://picsum.photos/seed/xauusd-trading/1200/900",
    es: {
      title: "Sistema de trading automatizado (XAUUSD)",
      role: "Diseño de arquitectura & desarrollo",
      summary:
        "Sistema de trading automatizado en MetaTrader 5 con seis módulos MQL5 (SignalEngine, PositionSizer, StopManager, OrderHandler, Logger, EA_Main) siguiendo arquitectura SOLID, con gestión de riesgo del 1% por operación.",
    },
    en: {
      title: "Automated Gold Trading System (XAUUSD)",
      role: "Architecture design & development",
      summary:
        "Automated MetaTrader 5 trading system with six MQL5 modules (SignalEngine, PositionSizer, StopManager, OrderHandler, Logger, EA_Main) built on SOLID architecture, with 1%-per-trade risk management.",
    },
  },
  {
    slug: "innovar-redesign",
    year: "2026",
    featured: false,
    stack: ["Information Architecture", "SEO", "Core Web Vitals"],
    image: "https://picsum.photos/seed/innovar-redesign/1200/900",
    es: {
      title: "Rediseño web — Innovar Reparaciones y Construcciones",
      role: "Auditoría UX & estrategia de contenido",
      summary:
        "Auditoría de un sitio WordPress existente (video autoplay afectando Core Web Vitals, submenús anidados, iconografía genérica) y entrega de una arquitectura de información consolidada en 6 categorías de servicio, con requisitos SEO y schema.",
    },
    en: {
      title: "Website Redesign — Innovar Construction",
      role: "UX audit & content strategy",
      summary:
        "Audited an existing WordPress site (autoplay video hurting Core Web Vitals, nested submenus, generic iconography) and delivered a consolidated 6-category information architecture with SEO and schema requirements.",
    },
  },
];
