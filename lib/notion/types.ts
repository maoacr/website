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
