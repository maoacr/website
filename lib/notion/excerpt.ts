import type { NotionBlock } from "./types";

/** Google truncates meta descriptions past roughly this length. */
const MAX_DESCRIPTION_LENGTH = 160;

const TEXT_BEARING_TYPES = new Set([
  "paragraph",
  "quote",
  "callout",
  "bulleted_list_item",
  "numbered_list_item",
]);

/**
 * Builds a meta-description-sized summary from the body of a post, for
 * when the Notion database has no Excerpt/Summary column.
 *
 * A description is what shows under the title in Google results and on
 * every social card — leaving it empty (or filling it with a single-word
 * Category, as this used to) wastes the highest-value snippet a page
 * gets. Headings and code blocks are skipped on purpose: a heading
 * repeats the title, and a code fence reads as noise out of context.
 */
export function deriveExcerpt(blocks: NotionBlock[]): string | null {
  const parts: string[] = [];

  for (const block of blocks) {
    if (!TEXT_BEARING_TYPES.has(block.type)) continue;

    const value = block[block.type] as { rich_text?: { plain_text: string }[] } | undefined;
    const text = (value?.rich_text ?? []).map((run) => run.plain_text).join("").trim();
    if (!text) continue;

    parts.push(text);
    if (parts.join(" ").length >= MAX_DESCRIPTION_LENGTH) break;
  }

  const joined = parts.join(" ").replace(/\s+/g, " ").trim();
  if (!joined) return null;
  return truncateOnWord(joined, MAX_DESCRIPTION_LENGTH);
}

/** Cuts at the last whole word so the summary never ends mid-word. */
function truncateOnWord(input: string, max: number): string {
  if (input.length <= max) return input;
  const clipped = input.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}
