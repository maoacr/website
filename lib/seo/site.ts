import type { Locale } from "@/lib/i18n/config";

// Single source of truth for everything that identifies the site to
// crawlers, social cards and structured data. This used to be a
// `const SITE_URL` copy-pasted into layout.tsx, sitemap.ts and robots.ts —
// three places to miss if the domain ever changes.
export const SITE_URL = "https://maoacr.com";
export const SITE_NAME = "Mario Crespo";
export const AUTHOR_NAME = "Mario Alejandro Crespo Reyes";
export const AUTHOR_SHORT_NAME = "Mao Crespo";
export const AUTHOR_EMAIL = "iam@maoacr.com";
export const AUTHOR_LINKEDIN = "https://linkedin.com/in/maoacr";

/**
 * BCP 47 language tags for `<html lang>`.
 *
 * The route segment is a bare "es"/"en" (short, clean URLs), but the
 * document itself declares the *regional* variant: this is a Colombian
 * portfolio, so Spanish is es-CO, not generic es. Search engines and
 * screen readers both use this — it drives pronunciation, and it tells
 * Google which regional audience the page targets.
 */
export const HTML_LANG: Record<Locale, string> = {
  es: "es-CO",
  en: "en-US",
};

/** OpenGraph uses underscore-separated locale codes, not BCP 47 hyphens. */
export const OG_LOCALE: Record<Locale, string> = {
  es: "es_CO",
  en: "en_US",
};
