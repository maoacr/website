/**
 * The brand palette, for the places that cannot read CSS.
 *
 * `app/globals.css` is where these colours live for everything that
 * renders in a browser: the custom properties there feed Tailwind through
 * `@theme inline`, and every component styles itself with the resulting
 * `bg-*` / `text-*` / `border-*` tokens.
 *
 * Three surfaces can't reach that:
 *
 *   - The two `opengraph-image.tsx` routes render through Satori, which
 *     resolves neither custom properties nor Tailwind classes — only
 *     inline styles with literal values.
 *   - `manifest.ts` is JSON handed to the OS for the installed-app icon
 *     and splash, long before any stylesheet exists.
 *
 * They used to carry the palette copy-pasted, ten literals across three
 * files. Changing a brand colour left them silently on the old one: no
 * error, no failed build — just social cards and an app icon quietly out
 * of date, usually noticed weeks later by someone else.
 *
 * This file is the one place those three import from. It does NOT remove
 * the duplication — CSS and TypeScript genuinely cannot share a single
 * literal here, because Tailwind needs the values at stylesheet-parse
 * time. It reduces eleven copies to two, and `npm run verify:brand`
 * fails when the two drift, so the mismatch can't ship.
 *
 * Change a colour in BOTH this file and app/globals.css.
 */

/** Named primitives. Must match the `:root` block in app/globals.css. */
export const brand = {
  paper: "#f5f5f2",
  graphite: "#0a0a0c",
  ink: "#111214",
  fog: "#e8e7e2",
  signal: "#ff4520",
  paramo: "#2f6e5c",
  line: "#d8d6ce",
} as const;

/**
 * Semantic values resolved for the dark theme. Must match the `.dark`
 * block in app/globals.css.
 *
 * OpenGraph cards are always dark regardless of the viewer's theme — a
 * social card has no viewer preference to read — so they take their
 * greys from here rather than from the light defaults.
 */
export const brandDark = {
  surface: "#131315",
  border: "#232326",
  muted: "#97968f",
} as const;
