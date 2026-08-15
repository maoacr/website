/**
 * Turns a Notion page title into a URL-safe slug, suffixed with a short
 * chunk of the page's own id.
 *
 * Why the suffix: there's no dedicated "Slug" column in the database, so
 * the slug has to come from the title. But titles get edited — that's
 * normal editorial life. If the slug were `slugify(title)` alone, renaming
 * a post in Notion would silently change its URL and 404 every link
 * that's already out there (shared, bookmarked, or indexed by Google).
 * The id suffix is permanent for the life of the page, so the permalink
 * never moves even if the title changes completely.
 */
export function buildSlug(title: string, pageId: string): string {
  const base = slugify(title) || "post";
  const suffix = pageId.replace(/-/g, "").slice(-6);
  return `${base}-${suffix}`;
}

// U+0300–U+036F is the Unicode "Combining Diacritical Marks" block — after
// NFD normalization splits "á" into "a" + a combining acute accent, this
// strips the accent and leaves the bare letter.
const COMBINING_DIACRITICS = /[̀-ͯ]/g;

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
