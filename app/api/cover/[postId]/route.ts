import { notion } from "@/lib/notion/client";
import { isFullPage } from "@notionhq/client";

/**
 * Redirects to a post's current Notion cover.
 *
 * Covers uploaded to Notion are served from S3 behind a signature valid
 * for exactly one hour (`X-Amz-Expires: 3600`, measured against the live
 * database). Embedding that URL straight into HTML breaks, and not
 * occasionally:
 *
 * The blog pages are ISR with the same one-hour window, and Next serves a
 * stale page to the first visitor after it lapses while regenerating in
 * the background. On a site with steady traffic that is a narrow window;
 * on a personal blog, where a page can sit untouched for a day, the first
 * visitor back is *reliably* the one who gets a dead image — with no error
 * anywhere, just a broken frame.
 *
 * Lowering `revalidate` does not fix it, because stale-while-revalidate
 * puts no upper bound on the age of the page actually served. The URL in
 * the HTML has to be one that never goes stale, which is this route: it
 * resolves the signature at request time and redirects.
 *
 * A 30-minute cache on the redirect keeps this from hitting Notion on
 * every image load while staying comfortably inside the one-hour
 * signature — a cached redirect is at most half-expired when it is
 * followed.
 *
 * The OpenGraph route deliberately does NOT use this: Satori bakes the
 * image into a PNG at generation time, when the direct URL is fresh, so
 * the result is self-contained and has nothing left to expire.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;

  try {
    const page = await notion.pages.retrieve({ page_id: postId });
    if (!isFullPage(page) || !page.cover) {
      return new Response("No cover", { status: 404 });
    }

    const url =
      page.cover.type === "external" ? page.cover.external.url : page.cover.file.url;

    return Response.redirect(url, 307);
  } catch {
    // A bad id, an unshared page, or Notion being down. A missing image is
    // not worth a 500 — the surfaces that render it already handle absence.
    return new Response("No cover", { status: 404 });
  }
}

export const revalidate = 1800;
