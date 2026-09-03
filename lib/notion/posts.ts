import "server-only";
import { cache } from "react";
import { isFullPage, type PageObjectResponse, type QueryDataSourceParameters } from "@notionhq/client";
import { notion, resolveSchema, type NotionSchema } from "./client";
import { buildSlug } from "./slug";
import type { BlogPost } from "./types";
import type { Locale } from "@/lib/i18n/config";

// Notion's values are what you typed in the UI — "ES"/"EN", not the site's
// lowercase `Locale` ("es"/"en"). This is the one place that translation
// happens.
const NOTION_LANG: Record<Locale, "ES" | "EN"> = { es: "ES", en: "EN" };

// "Status" and "lang" can each be a generic `select` or Notion's built-in
// `status` property type — same UI, different filter shape. Building the
// filter against the schema read at runtime (see resolveSchema in
// client.ts) instead of hardcoding one guess avoids a 400 the day the
// assumption is wrong. Cast to `any` is deliberate here: the SDK's filter
// type is a closed discriminated union keyed by property kind, which
// can't express "pick the key dynamically" — the runtime shape is correct,
// TypeScript's static one just can't model it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function equalsFilter(property: string, value: string, schema: NotionSchema): any {
  const kind = schema.propertyTypes[property] === "status" ? "status" : "select";
  return { property, [kind]: { equals: value } };
}

function publishedFilter(
  locale: Locale,
  schema: NotionSchema,
): QueryDataSourceParameters["filter"] {
  return {
    and: [
      equalsFilter("Status", "Published", schema),
      equalsFilter("lang", NOTION_LANG[locale], schema),
    ],
  };
}

/**
 * The page id this post is a translation of, from whichever relation
 * column actually holds it.
 *
 * Notion's two-way relations come in a matched pair, and because this
 * relation points the database at itself, *both* sides land in this same
 * database as two separate columns — one you fill in by hand, one Notion
 * mirrors for you. Which of the two carries the value depends on which
 * side of the pair a given row sits on: the Spanish post here holds it in
 * one column and its English counterpart in the other. Reading a single
 * hardcoded column would resolve the link in one direction and silently
 * fail in the other.
 *
 * So relation columns are found by *type* rather than by name, and the
 * first one holding a value wins. That also means renaming them in Notion
 * — they're currently called "Lang" and "Relation", neither of which says
 * "translation" — won't break anything here.
 */
function readTranslationId(props: PageObjectResponse["properties"]): string | null {
  for (const prop of Object.values(props)) {
    if (prop.type !== "relation") continue;
    const id = prop.relation[0]?.id;
    if (id) return id;
  }
  return null;
}

function mapPage(page: PageObjectResponse, locale: Locale): BlogPost {
  const props = page.properties;

  const title =
    props.Title?.type === "title"
      ? props.Title.title.map((t) => t.plain_text).join("")
      : "";

  const category =
    props.Category?.type === "select"
      ? (props.Category.select?.name ?? null)
      : props.Category?.type === "status"
        ? (props.Category.status?.name ?? null)
        : null;

  const tags =
    props.Tags?.type === "multi_select" ? props.Tags.multi_select.map((t) => t.name) : [];

  // Author can be a Notion "Person" (people property) or a manually typed
  // field (rich_text/select) — handle whichever this database actually uses
  // instead of assuming and breaking on the other.
  let author: string | null = null;
  const authorProp = props.Author;
  if (authorProp?.type === "people") {
    const person = authorProp.people[0];
    author = person && "name" in person ? (person.name ?? null) : null;
  } else if (authorProp?.type === "rich_text") {
    author = authorProp.rich_text.map((t) => t.plain_text).join("") || null;
  } else if (authorProp?.type === "select") {
    author = authorProp.select?.name ?? null;
  }

  const publishedDate =
    props["Published Date"]?.type === "date"
      ? (props["Published Date"].date?.start ?? null)
      : null;

  // Optional — not in REQUIRED_PROPERTIES, so a database without either
  // column keeps working; the post page falls back to deriving a summary
  // from the body text.
  const excerptProp = props.Excerpt ?? props.Summary;
  const excerpt =
    excerptProp?.type === "rich_text"
      ? excerptProp.rich_text.map((t) => t.plain_text).join("").trim() || null
      : null;

  // Presence of a password IS the "protected" flag — no separate checkbox
  // column, so the broken state (flag on, no password) can't exist. Only
  // the boolean crosses into BlogPost; see the note on the type.
  const isProtected = readPassword(props) !== null;

  return {
    id: page.id,
    slug: buildSlug(title, page.id),
    title,
    category,
    tags,
    author,
    publishedDate,
    lang: locale,
    excerpt,
    isProtected,
    translationId: readTranslationId(props),
  };
}

/**
 * Reads the optional `Password` column off a raw Notion page.
 *
 * Kept as a standalone helper (rather than folded into `mapPage`) so the
 * secret only ever exists inside server-only call paths, and never on the
 * `BlogPost` object that gets serialized to the client.
 */
function readPassword(props: PageObjectResponse["properties"]): string | null {
  const prop = props.Password;
  if (prop?.type !== "rich_text") return null;
  return prop.rich_text.map((t) => t.plain_text).join("").trim() || null;
}

/**
 * Wrapped in React's `cache` so a single request that needs the same
 * locale's posts more than once — `generateMetadata` and the page body
 * both do, and so does the JSON-LD — pays for exactly one Notion query
 * instead of one per call site.
 */
export const getPublishedPosts = cache(async function getPublishedPosts(
  locale: Locale,
): Promise<BlogPost[]> {
  const schema = await resolveSchema();
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: schema.dataSourceId,
      filter: publishedFilter(locale, schema),
      sorts: [{ property: "Published Date", direction: "descending" }],
      start_cursor: cursor,
    });
    pages.push(...response.results.filter(isFullPage));
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages.map((page) => mapPage(page, locale));
});

/**
 * Posts safe to render in public surfaces — the blog listing and the
 * sitemap.
 *
 * Protected posts are reachable only by their direct URL, so they are
 * excluded here rather than shown behind a lock. This matters more than
 * it looks: the listing hands its posts to `BlogSearch`, a client
 * component, so anything in this array (title, category, tags, excerpt)
 * is delivered to every visitor's browser. Filtering at the source is
 * what keeps a protected post's metadata out of that payload — the same
 * reason drafts are filtered in the Notion query rather than in the UI.
 *
 * To instead advertise protected posts with a lock badge, render from
 * `getPublishedPosts` and strip `excerpt` — but decide that deliberately.
 */
export const getPublicPosts = cache(async function getPublicPosts(
  locale: Locale,
): Promise<BlogPost[]> {
  const posts = await getPublishedPosts(locale);
  return posts.filter((post) => !post.isProtected);
});

/**
 * Server-only read of a post's password. Never call this from anything
 * whose result reaches the client.
 */
export const getPostPassword = cache(async function getPostPassword(
  postId: string,
): Promise<string | null> {
  const page = await notion.pages.retrieve({ page_id: postId });
  return isFullPage(page) ? readPassword(page.properties) : null;
});

/**
 * There's no direct "get by slug" Notion query (slug isn't a real column —
 * see slug.ts) so this resolves it by listing this locale's published
 * posts and matching. Fine at personal-blog volume; if this ever needs to
 * scale, swap for a real Slug column + a `filter` on that property.
 */
/**
 * The published counterpart of a post in the other language, or null.
 *
 * Costs no extra Notion call in practice: the other locale's list is
 * behind the same `cache()` as everything else, and the pages that need
 * this (the post view, its metadata) are already loading posts.
 *
 * Returning null is a normal outcome, not an error — the relation may be
 * unset, and a counterpart still in Draft is deliberately invisible here
 * because `getPublishedPosts` filters on Status. An unfinished
 * translation can't leak through the language switch.
 */
export const getTranslation = cache(async function getTranslation(
  post: BlogPost,
): Promise<BlogPost | null> {
  if (!post.translationId) return null;
  const otherLocale: Locale = post.lang === "es" ? "en" : "es";
  const candidates = await getPublishedPosts(otherLocale);
  return candidates.find((candidate) => candidate.id === post.translationId) ?? null;
});

export const getPostBySlug = cache(async function getPostBySlug(
  locale: Locale,
  slug: string,
): Promise<BlogPost | null> {
  const posts = await getPublishedPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
});
