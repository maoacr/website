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
  };
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
 * There's no direct "get by slug" Notion query (slug isn't a real column —
 * see slug.ts) so this resolves it by listing this locale's published
 * posts and matching. Fine at personal-blog volume; if this ever needs to
 * scale, swap for a real Slug column + a `filter` on that property.
 */
export const getPostBySlug = cache(async function getPostBySlug(
  locale: Locale,
  slug: string,
): Promise<BlogPost | null> {
  const posts = await getPublishedPosts(locale);
  return posts.find((post) => post.slug === slug) ?? null;
});
