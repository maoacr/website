# Mario "Mao" Crespo — Portfolio

Sitio personal inmersivo, bilingüe (ES/EN) y con modo claro/oscuro,
construido en Next.js 16 (App Router) sobre un concepto de dirección de
arte tipo "reel de cine": cada sección es una escena con slugline de
guion, el scroll lleva un timecode real (24fps) en el HUD, y los cambios
de tema/idioma se resuelven con la View Transitions API nativa del
navegador (un "corte" suave, no un fade genérico).

## Stack

- **Next.js 16** (App Router, Turbopack, RSC) + **TypeScript**
- **Tailwind CSS v4** (tokens de color/tipografía en `app/globals.css` vía `@theme inline`)
- **Framer Motion** para las revelaciones de scroll
- **next-themes** para el modo claro/oscuro (persistente, sin flash)
- Fuentes autoalojadas (Archivo, Inter, JetBrains Mono) — sin llamada a
  `fonts.googleapis.com`, un request menos y funciona detrás de
  políticas de red estrictas

## Arquitectura (por qué está organizado así)

- **`lib/data/projects.ts`** es la única fuente de verdad de los
  proyectos. El componente `Projects` no sabe nada de "cuáles son los
  4 case studies": solo filtra por `featured`. Agregar, quitar o
  re-priorizar un proyecto se hace editando datos, nunca el componente
  (Open/Closed).
- **`lib/i18n/`** separa el *contenido* (`dictionaries.ts`) de la
  *configuración* (`config.ts`, locales soportados). `getDictionary(locale)`
  es la única función que las secciones necesitan conocer — si mañana
  el contenido viene de un CMS, solo cambia esa función (Dependency
  Inversion).
- **Cada sección vive en su propio componente** (`hero.tsx`,
  `projects.tsx`, `experience.tsx`...) con una sola responsabilidad:
  renderizar su parte del dictionary. `SceneHeading` centraliza el
  patrón visual "slugline + título" para que no se repita en cada
  sección (DRY).
- **`lib/hooks/use-has-mounted.ts`** resuelve con `useSyncExternalStore`
  el clásico problema de "esto solo existe en cliente" (tema, iconos)
  sin caer en el antipatrón de `setState` dentro de un efecto.

## Empezar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige a `/es`
o `/en` según el idioma del navegador.

```bash
npm run build   # build de producción
npm run typecheck
npm run lint
```

## Pendiente antes de publicar

1. **Imágenes de proyectos**: hoy son placeholders deterministas de
   `picsum.photos` (ver nota en `lib/data/projects.ts`). Reemplaza cada
   `image` por la ruta real en `/public/projects/` cuando tengas los
   assets finales de cada caso (Quarto, SGD, Ley de Insolvencia, Nova...).
2. **`og-image.png`**: falta la imagen 1200×630 para OpenGraph/Twitter
   Card (referenciada en `app/[locale]/layout.tsx`).
3. **Dominio**: `SITE_URL` está hardcodeado a `https://maoacr.com` en
   `layout.tsx`, `sitemap.ts` y `robots.ts` — ajústalo si el dominio final es otro.
4. **CV descargable** (opcional): si quieres un botón "Descargar CV",
   agrega el PDF a `/public/` y un link en `components/contact.tsx` —
   hoy la sección de contacto solo tiene email, WhatsApp y LinkedIn.

## SEO & discoverability

- Metadata completa (title template, OpenGraph, Twitter Card,
  `hreflang` ES/EN/x-default) generada por locale en `generateMetadata`.
- JSON-LD `Person` + `WebSite` (schema.org) inyectado en el `<head>`.
- `sitemap.ts` y `robots.ts` vía las convenciones nativas de Next.js.
- `public/llms.txt`: resumen estructurado del perfil y los proyectos
  para que asistentes de IA (ChatGPT, Claude, Perplexity...) puedan
  leer y citar el sitio correctamente; `robots.ts` los admite
  explícitamente (GPTBot, ClaudeBot, PerplexityBot, etc.).
