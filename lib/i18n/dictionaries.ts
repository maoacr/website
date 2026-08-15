import type { Locale } from "./config";

export const dictionaries = {
  es: {
    meta: {
      title: "Mario Crespo — Software Engineer",
      description:
        "Ingeniero de software especializado en React y Next.js, con más de 10 años de experiencia audiovisual. Con base en Fusagasugá, Colombia.",
    },
    nav: {
      role: "Software Engineer",
      switchTheme: "Cambiar tema",
      switchLocale: "Switch to English",
    },
    hero: {
      slugline: "INT. ESTUDIO — DÍA 1",
      kicker: "Software Engineer · Dirección de arte digital",
      name: "Mario Alejandro\nCrespo Reyes",
      lead: "Escribo interfaces con la misma disciplina con la que se edita una escena: cada corte, cada encuadre y cada línea de código tienen que justificar su lugar.",
      cta1: "Ver proyectos",
      cta2: "Hablemos",
      scrollCue: "Desplázate para reproducir",
      rec: "REC",
    },
    about: {
      slugline: "INT. ESTUDIO — DÍA",
      title: "Sobre mí",
      paragraphs: [
        "Apasionado por el aprendizaje continuo y la innovación. Mi enfoque principal es dominar JavaScript, aplicando principios de clean code y SOLID para crear soluciones eficientes y mantenibles.",
        "Con fuertes habilidades en UX/UI, combino creatividad y adaptabilidad para desarrollar interfaces intuitivas y atractivas. Más de 10 años en el ámbito gráfico y audiovisual me permiten ofrecer un valor añadido en el desarrollo visual de proyectos tecnológicos.",
      ],
      stats: [
        { value: "10+", label: "años en diseño audiovisual" },
        { value: "05", label: "empresas y estudios" },
        { value: "150+", label: "cursos completados en Platzi" },
        { value: "01", label: "premio de cortometraje — FICFUSA" },
      ],
      educationTitle: "Formación",
      education: [
        {
          school: "Corporación Unificada Nacional de Educación Superior (CUN)",
          program: "Ingeniería de Software",
          period: "ago. 2026 — ago. 2029",
        },
        {
          school: "Platzi Master",
          program: "Web Developer, Software — Bootcamp de Desarrollo Frontend",
          period: "2019 — 2021",
        },
      ],
    },
    experience: {
      slugline: "INT. OFICINA — LÍNEA DE TIEMPO",
      title: "Experiencia",
      items: [
        {
          company: "Perficient",
          role: "Senior Consultant",
          period: "oct. 2025 — abr. 2026",
          bullets: [
            "Lideré el desarrollo de aplicaciones web modernas y de alto rendimiento con React y Next.js.",
            "Actué como puente estratégico entre los equipos de diseño e ingeniería.",
            "Transformé conceptos visuales complejos en sistemas de componentes escalables, con fidelidad pixel-perfect sin sacrificar performance ni accesibilidad.",
          ],
        },
        {
          company: "Sorcol",
          role: "Frontend Developer",
          period: "jul. 2023 — jul. 2025",
          bullets: [
            "Lideré un equipo de desarrolladoras, impulsando nuevas habilidades técnicas y de liderazgo.",
            "Desarrollo con React, JavaScript, Hooks, Context, Redux y Tailwind para interfaces eficientes y responsivas.",
            "Fomenté un ambiente de colaboración y aprendizaje continuo, con revisiones de código y testing constantes.",
          ],
        },
        {
          company: "Globant",
          role: "Web UI Developer Semi-senior",
          period: "mar. 2021 — may. 2023",
          bullets: [
            "Desarrollo de features y resolución de bugs para clientes de Retail, Salud y productos internos.",
            "Stack: JavaScript vanilla, React.js, Redux, HTML5, CSS3, Styled-components, Sass.",
          ],
        },
        {
          company: "Distriandamios SAS",
          role: "Digital Master",
          period: "2020",
          bullets: ["Creación y mantenimiento del sitio corporativo."],
        },
        {
          company: "Viverplas",
          role: "Digital Master",
          period: "2019",
          bullets: ["Creación y mantenimiento del sitio corporativo con WordPress."],
        },
        {
          company: "Freelance",
          role: "Diseño, fotografía y producción audiovisual",
          period: "desde 2011",
          bullets: [
            "Branding, fotografía, retoque, producción de audio y video, impresión de gran formato.",
            "Logro: Orquídea Andina al mejor cortometraje — FICFUSA 2019, por el cortometraje 'Rosa'.",
          ],
        },
      ],
    },
    projects: {
      slugline: "EXT. PORTAFOLIO — TRAVELLING",
      title: "Proyectos",
      subtitle:
        "Cuatro proyectos representan el rango del trabajo: de marca a producto, de frontend a arquitectura full-stack. Las imágenes finales de cada uno están en producción.",
      cta: "Ver detalle",
      placeholderTag: "En edición",
      moreWorkTitle: "Más trabajo",
      moreWorkSubtitle: "Otros proyectos recientes, fuera de los cuatro casos principales.",
    },
    skills: {
      slugline: "INT. TALLER — HERRAMIENTAS",
      title: "Stack & herramientas",
      groups: [
        {
          label: "Lenguajes",
          items: [
            { name: "JavaScript", level: "Avanzado" },
            { name: "HTML5", level: "Avanzado" },
            { name: "CSS3", level: "Avanzado" },
            { name: "TypeScript", level: "Intermedio" },
          ],
        },
        {
          label: "Frameworks",
          items: [
            { name: "React.js", level: "Avanzado" },
            { name: "Next.js", level: "Avanzado" },
            { name: "Sass", level: "Intermedio" },
            { name: "Styled-components", level: "Intermedio" },
            { name: "Tailwind", level: "Básico" },
            { name: "Astro", level: "Básico" },
          ],
        },
        {
          label: "Datos",
          items: [
            { name: "GraphQL", level: "Básico" },
            { name: "MongoDB", level: "Básico" },
            { name: "SQL", level: "Básico" },
          ],
        },
        {
          label: "Herramientas",
          items: [
            { name: "Git & GitHub", level: "Avanzado" },
            { name: "Figma", level: "Avanzado" },
            { name: "Jira", level: "Avanzado" },
            { name: "Adobe Illustrator", level: "Avanzado" },
            { name: "Adobe Photoshop", level: "Avanzado" },
            { name: "Notion", level: "Intermedio" },
          ],
        },
      ],
      languagesTitle: "Idiomas",
      languages: [
        { name: "Español", level: "Nativo" },
        { name: "Inglés", level: "Fluido" },
      ],
    },
    contact: {
      slugline: "EXT. CRÉDITOS — FINAL",
      title: "Hagamos algo juntos",
      lead: "Disponible para proyectos freelance, consultoría de producto y roles de ingeniería frontend/full-stack.",
      email: "Escribir un correo",
      whatsapp: "WhatsApp",
      location: "Fusagasugá, Colombia · GMT-5",
    },
    blog: {
      navLabel: "Blog",
      slugline: "INT. SALA DE EDICIÓN — ARCHIVO",
      title: "Blog",
      subtitle: "Notas sobre desarrollo, arquitectura y dirección de arte digital.",
      searchPlaceholder: "Buscar por título, categoría, tag o autor...",
      empty: "No hay posts que coincidan con la búsqueda.",
      back: "Volver al blog",
      dateLocale: "es-CO",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      builtWith: "Diseñado y desarrollado por Mario Crespo.",
      backToTop: "Volver arriba",
    },
  },
  en: {
    meta: {
      title: "Mario Crespo — Software Engineer",
      description:
        "Software engineer specialized in React and Next.js, with 10+ years of audiovisual production experience. Based in Fusagasugá, Colombia.",
    },
    nav: {
      role: "Software Engineer",
      switchTheme: "Toggle theme",
      switchLocale: "Cambiar a Español",
    },
    hero: {
      slugline: "INT. STUDIO — DAY 1",
      kicker: "Software Engineer · Digital Art Direction",
      name: "Mario Alejandro\nCrespo Reyes",
      lead: "I write interfaces with the same discipline you'd edit a scene: every cut, every frame, every line of code has to earn its place.",
      cta1: "View projects",
      cta2: "Let's talk",
      scrollCue: "Scroll to play",
      rec: "REC",
    },
    about: {
      slugline: "INT. STUDIO — DAY",
      title: "About",
      paragraphs: [
        "Passionate about continuous learning and innovation. My core focus is mastering JavaScript, applying clean code and SOLID principles to build efficient, maintainable solutions.",
        "With strong UX/UI skills, I combine creativity and adaptability to build intuitive, engaging interfaces. Over 10 years in graphic and audiovisual production let me bring extra value to the visual development of technology products.",
      ],
      stats: [
        { value: "10+", label: "years in visual production" },
        { value: "05", label: "companies & studios" },
        { value: "150+", label: "courses completed on Platzi" },
        { value: "01", label: "short-film award — FICFUSA" },
      ],
      educationTitle: "Education",
      education: [
        {
          school: "Corporación Unificada Nacional de Educación Superior (CUN)",
          program: "Software Engineering",
          period: "Aug 2026 — Aug 2029",
        },
        {
          school: "Platzi Master",
          program: "Web Developer, Software — Frontend Development Bootcamp",
          period: "2019 — 2021",
        },
      ],
    },
    experience: {
      slugline: "INT. OFFICE — TIMELINE",
      title: "Experience",
      items: [
        {
          company: "Perficient",
          role: "Senior Consultant",
          period: "Oct 2025 — Apr 2026",
          bullets: [
            "Led development of modern, high-performance web applications using React and Next.js.",
            "Served as the strategic bridge between the design and engineering teams.",
            "Transformed complex visual concepts into scalable component systems with pixel-perfect fidelity, without compromising performance or accessibility.",
          ],
        },
        {
          company: "Sorcol",
          role: "Frontend Developer",
          period: "Jul 2023 — Jul 2025",
          bullets: [
            "Led a team of developers, growing new technical and leadership skills.",
            "Built with React, JavaScript, Hooks, Context, Redux and Tailwind for efficient, responsive interfaces.",
            "Fostered collaboration and continuous learning through constant code review and testing.",
          ],
        },
        {
          company: "Globant",
          role: "Web UI Developer Semi-senior",
          period: "Mar 2021 — May 2023",
          bullets: [
            "Feature development and bug resolution for Retail, Health and internal-product clients.",
            "Stack: vanilla JavaScript, React.js, Redux, HTML5, CSS3, Styled-components, Sass.",
          ],
        },
        {
          company: "Distriandamios SAS",
          role: "Digital Master",
          period: "2020",
          bullets: ["Creation and maintenance of the corporate website."],
        },
        {
          company: "Viverplas",
          role: "Digital Master",
          period: "2019",
          bullets: ["Creation and maintenance of the corporate website with WordPress."],
        },
        {
          company: "Freelance",
          role: "Design, photography & audiovisual production",
          period: "since 2011",
          bullets: [
            "Branding, photography, retouching, audio/video production, large-format printing.",
            "Award: Orquídea Andina for best short film — FICFUSA 2019, for the short film 'Rosa'.",
          ],
        },
      ],
    },
    projects: {
      slugline: "EXT. PORTFOLIO — TRAVELLING SHOT",
      title: "Projects",
      subtitle:
        "Four projects span the range of the work: from brand to product, from frontend to full-stack architecture. Final imagery for each is still in the edit bay.",
      cta: "View case study",
      placeholderTag: "In edit",
      moreWorkTitle: "More work",
      moreWorkSubtitle: "Other recent projects, outside the four main case studies.",
    },
    skills: {
      slugline: "INT. WORKSHOP — TOOLS",
      title: "Stack & tools",
      groups: [
        {
          label: "Languages",
          items: [
            { name: "JavaScript", level: "Advanced" },
            { name: "HTML5", level: "Advanced" },
            { name: "CSS3", level: "Advanced" },
            { name: "TypeScript", level: "Intermediate" },
          ],
        },
        {
          label: "Frameworks",
          items: [
            { name: "React.js", level: "Advanced" },
            { name: "Next.js", level: "Advanced" },
            { name: "Sass", level: "Intermediate" },
            { name: "Styled-components", level: "Intermediate" },
            { name: "Tailwind", level: "Basic" },
            { name: "Astro", level: "Basic" },
          ],
        },
        {
          label: "Data",
          items: [
            { name: "GraphQL", level: "Basic" },
            { name: "MongoDB", level: "Basic" },
            { name: "SQL", level: "Basic" },
          ],
        },
        {
          label: "Tools",
          items: [
            { name: "Git & GitHub", level: "Advanced" },
            { name: "Figma", level: "Advanced" },
            { name: "Jira", level: "Advanced" },
            { name: "Adobe Illustrator", level: "Advanced" },
            { name: "Adobe Photoshop", level: "Advanced" },
            { name: "Notion", level: "Intermediate" },
          ],
        },
      ],
      languagesTitle: "Languages",
      languages: [
        { name: "Spanish", level: "Native" },
        { name: "English", level: "Fluent" },
      ],
    },
    contact: {
      slugline: "EXT. CREDITS — FINAL",
      title: "Let's build something",
      lead: "Available for freelance projects, product consulting, and frontend/full-stack engineering roles.",
      email: "Send an email",
      whatsapp: "WhatsApp",
      location: "Fusagasugá, Colombia · GMT-5",
    },
    blog: {
      navLabel: "Blog",
      slugline: "INT. EDIT BAY — ARCHIVE",
      title: "Blog",
      subtitle: "Notes on development, architecture and digital art direction.",
      searchPlaceholder: "Search by title, category, tag or author...",
      empty: "No posts match your search.",
      back: "Back to blog",
      dateLocale: "en-US",
    },
    footer: {
      rights: "All rights reserved.",
      builtWith: "Designed and built by Mario Crespo.",
      backToTop: "Back to top",
    },
  },
};

export type Dictionary = (typeof dictionaries)["es"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
