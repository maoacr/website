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
2. **CV descargable** (opcional): si quieres un botón "Descargar CV",
   agrega el PDF a `/public/` y un link en `components/contact.tsx` —
   hoy la sección de contacto solo tiene email, WhatsApp y LinkedIn.

## SEO & discoverability

- **`lib/seo/site.ts`** es la única fuente de verdad del dominio, la
  identidad y los códigos de idioma. `SITE_URL` ya no está duplicado en
  `layout.tsx` / `sitemap.ts` / `robots.ts`: se cambia en un solo lugar.
- Metadata completa por locale en `generateMetadata` (title template,
  keywords, authors, OpenGraph, Twitter Card, `hreflang` ES/EN/x-default,
  `robots` con `max-image-preview:large` para que Google muestre miniatura
  grande en resultados).
- **`<html lang>` regional**: `es-CO` / `en-US`, no `es` genérico — el
  sitio apunta a audiencia colombiana (`HTML_LANG` en `lib/seo/site.ts`).
- **Imágenes OpenGraph generadas** con `next/og` (`opengraph-image.tsx`),
  una por locale y **una por post de blog** con su propio título. No hay
  ningún PNG que mantener a mano ni que se desincronice del contenido.
  Nota: se renderizan con la fuente por defecto de Satori, no con Archivo
  — Satori no resuelve fuentes variables de forma confiable.
- JSON-LD: `Person` + `WebSite` en el root, `Blog` + `BreadcrumbList` en
  el listado, y `BlogPosting` + `BreadcrumbList` en cada post, todos
  enlazados al mismo `#person` para que Google lea el portafolio y el
  blog como una sola identidad.
- Descripción de cada post: columna opcional `Excerpt`/`Summary` en
  Notion; si no existe, se deriva del primer párrafo del cuerpo
  (`lib/notion/excerpt.ts`), recortada a 160 caracteres sin cortar palabras.
- `sitemap.ts` y `robots.ts` vía las convenciones nativas de Next.js. El
  sitemap incluye home, `/blog` y **cada post publicado** por locale; si
  Notion falla en build, degrada a las rutas estáticas en vez de tumbar
  el deploy.
- **`lastmod` solo cuando es verdad.** El sitemap se regenera cada hora,
  así que un `new Date()` afirmaría que la home cambió hace una hora…
  cada hora, para siempre. Google solo hace caso al `lastmod` mientras le
  demuestres que es fiable: si le das ruido, descarta el campo para todo
  el sitio — incluidos los posts, donde la fecha sí es real. Por eso la
  home **omite** `lastmod`, `/blog` usa la fecha del post más reciente
  (que es genuinamente cuándo cambió el listado), y un post sin
  `Published Date` no reporta fecha en lugar de inventarla.
- `public/llms.txt`: resumen estructurado del perfil y los proyectos
  para que asistentes de IA (ChatGPT, Claude, Perplexity...) puedan
  leer y citar el sitio correctamente; `robots.ts` los admite
  explícitamente (GPTBot, ClaudeBot, PerplexityBot, etc.).

## Entradas protegidas con contraseña

Un post se protege agregándole una contraseña en la columna **`Password`**
(rich text) de la database de Notion. La sola presencia de un valor ahí lo
marca como protegido — no hay un checkbox aparte, así que el estado roto
"marcado como privado pero sin clave" no puede existir. La columna es
opcional: una database sin ella sigue funcionando igual.

**Cómo funciona la protección** (`lib/blog/access.ts`):

- El gate corre en el Server Component **antes** de pedirle el cuerpo del
  post a Notion. Un visitante sin acceso recibe un HTML que nunca
  contuvo el contenido — a diferencia de esconderlo con CSS o JS, donde
  el texto ya viajó al navegador y se lee con "ver código fuente".
- La cookie de acceso **no** es una bandera tipo `true`: eso lo falsifica
  cualquiera con curl, porque las cookies son datos controlados por el
  cliente. Es un HMAC del id del post, firmado con la contraseña de ese
  mismo post. Consecuencia útil: cambiar la contraseña en Notion invalida
  al instante todas las cookies ya entregadas.
- Las comparaciones (contraseña y token) son de tiempo constante, sobre
  hashes de largo fijo.
- Leer cookies vuelve la ruta dinámica, así que **los posts protegidos
  pierden el ISR** y se renderizan por request. Los públicos conservan su
  cache.

**Lo que se tapó para que no se filtre por los costados** — cada uno era
una fuga real:

- La meta description **no** se deriva del cuerpo en un post protegido
  (`resolveDescription`), o publicaría sus primeras líneas en el `<head>`.
  Si querés un teaser público, escribilo a mano en la columna `Excerpt`.
- El listado y el sitemap usan `getPublicPosts`, que los excluye. El
  listado le pasa sus posts a `BlogSearch`, un client component: sin ese
  filtro, título, tags y excerpt viajarían al navegador de cualquiera.
- La OG image se renderiza genérica (sin título, categoría ni fecha
  reales). Esa imagen se sirve sin cookie porque los crawlers sociales no
  pueden autenticarse.
- Los posts protegidos van con `robots: noindex, nofollow`.

**Limitaciones conocidas, a propósito:**

- La contraseña se guarda en texto plano en Notion. Quien tenga acceso a
  tu database las ve todas. Es el precio de tener una clave por post
  editable desde Notion.
- No hay rate limiting en los intentos. Para enlaces privados compartidos
  a mano alcanza; si algún día esto protege algo sensible de verdad, hay
  que agregarlo (Vercel Firewall o un contador por IP).
- Los posts protegidos **no aparecen en el listado**: se llega solo por
  URL directa. Si preferís mostrarlos con un candado, la nota en
  `getPublicPosts` explica qué cambiar.
