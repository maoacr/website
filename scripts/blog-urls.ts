/**
 * Prints the final public URL of every published post, including the
 * password-protected ones.
 *
 * Protected posts are deliberately absent from the blog listing and the
 * sitemap, and their slug carries an id-derived suffix that can't be
 * guessed from the title — so there is no way to click your way to the
 * link you need to share. This is that way.
 *
 * Run it with:
 *   npm run blog:urls
 *
 * It imports `buildSlug` from the same module the site uses rather than
 * reimplementing the rule, so the two can never disagree. It does issue
 * its own Notion query instead of reusing lib/notion/posts.ts: those
 * functions are marked `server-only` (they'd throw outside a React
 * Server Component), and this script deliberately wants the unfiltered
 * list that the public getters exist to withhold.
 */
import { Client, isFullDatabase, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client";
import { buildSlug } from "../lib/notion/slug.ts";

const SITE_URL = "https://maoacr.com";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Run via "npm run blog:urls", which loads .env.local.`);
    process.exit(1);
  }
  return value;
}

function plainText(property: unknown): string {
  const runs = (property as { rich_text?: { plain_text: string }[]; title?: { plain_text: string }[] })
    ?? {};
  const items = runs.title ?? runs.rich_text ?? [];
  return items.map((run) => run.plain_text).join("").trim();
}

/**
 * Reads a single-choice property by name.
 *
 * Notion has two property kinds that look identical in the UI but are
 * distinct in the API: the generic `select`, and the built-in `status`
 * used for board columns. This database uses `status` for Status and
 * `select` for lang, so reading only `.select` reports every row as "—".
 * The site handles this by reading the real schema (see resolveSchema);
 * here, checking both shapes is enough and keeps the script dependency-free.
 */
/**
 * The linked translation's page id, from whichever relation column holds
 * it. Mirrors readTranslationId in lib/notion/posts.ts — a two-way Notion
 * relation puts one side in each of two columns, so which column carries
 * the value depends on which row you're looking at.
 */
function relationId(properties: Record<string, unknown>): string | null {
  for (const value of Object.values(properties)) {
    const prop = value as { type?: string; relation?: { id: string }[] };
    if (prop?.type !== "relation") continue;
    const id = prop.relation?.[0]?.id;
    if (id) return id;
  }
  return null;
}

function choiceName(property: unknown): string | null {
  const prop = property as {
    select?: { name: string } | null;
    status?: { name: string } | null;
  } | null;
  return prop?.status?.name ?? prop?.select?.name ?? null;
}

async function main() {
  const notion = new Client({ auth: requireEnv("NOTION_API_KEY") });
  const databaseId = requireEnv("NOTION_DATABASE_ID");

  const database = await notion.databases.retrieve({ database_id: databaseId });
  if (!isFullDatabase(database) || database.data_sources.length === 0) {
    console.error("That database exposes no queryable data source.");
    process.exit(1);
  }

  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;
  do {
    const response = await notion.dataSources.query({
      data_source_id: database.data_sources[0].id,
      start_cursor: cursor,
    });
    pages.push(...response.results.filter(isFullPage));
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  if (pages.length === 0) {
    console.log("No rows found in the database.");
    return;
  }

  const titleById = new Map(
    pages.map((page) => [page.id, plainText(page.properties.Title) || "(untitled)"]),
  );

  for (const page of pages) {
    const title = titleById.get(page.id)!;
    const status = choiceName(page.properties.Status) ?? "—";
    const lang = (choiceName(page.properties.lang) ?? "es").toLowerCase();
    const isProtected = plainText(page.properties.Password).length > 0;
    const isPublished = status === "Published";

    const marks = [
      isPublished ? "published" : status.toLowerCase(),
      isProtected ? "protected" : null,
    ]
      .filter(Boolean)
      .join(", ");

    console.log(`\n${title}`);
    console.log(`  [${lang}] [${marks}]`);
    if (isPublished) {
      console.log(`  ${SITE_URL}/${lang}/blog/${buildSlug(title, page.id)}`);
    } else {
      console.log("  (not published — no public URL yet)");
    }

    const translation = relationId(page.properties);
    if (translation) {
      console.log(`  translation -> ${titleById.get(translation) ?? "(row not in this query)"}`);
    }
  }
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
