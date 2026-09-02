import type { Locale } from "@/lib/i18n/config";

export type BlogPost = {
  /** Raw Notion page id — the source of truth `slug` is derived from. */
  id: string;
  /** `<slugified-title>-<id-suffix>`. Stable even if the title is edited later. */
  slug: string;
  title: string;
  category: string | null;
  tags: string[];
  author: string | null;
  /** ISO date string (Notion's native format), or null if unset. */
  publishedDate: string | null;
  lang: Locale;
  /**
   * Short summary used as the page's meta description and social-card
   * text. Read from an optional "Excerpt" (or "Summary") rich-text column
   * in Notion; null when that column doesn't exist, in which case the
   * post page derives one from the first paragraph of the body.
   */
  excerpt: string | null;
  /**
   * True when the Notion row has a non-empty `Password` column.
   *
   * The password itself is deliberately NOT part of this type. `BlogPost`
   * objects are handed to `BlogSearch`, a client component, so every
   * field here ships to the browser — a secret on this type would be
   * readable by anyone with devtools. Reading the actual password is a
   * separate, server-only call: `getPostPassword` in posts.ts.
   */
  isProtected: boolean;
};

/**
 * Minimal shape we actually consume from `blocks.children.list`. The full
 * Notion SDK type is a large discriminated union — re-declaring it here
 * keeps the renderer's `switch` exhaustive-checkable without importing
 * Notion's internal API types into every component that touches a post.
 */
export type NotionBlock = {
  id: string;
  type: string;
  has_children: boolean;
  children?: NotionBlock[];
  [key: string]: unknown;
};
