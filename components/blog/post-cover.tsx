import type { BlogPost } from "@/lib/notion/types";
import { coverProxyPath } from "@/lib/notion/cover";

/**
 * A post's banner, or a marked empty frame when it has none.
 *
 * The empty state is deliberate rather than a collapsed element: a post
 * with no cover keeps the same shape as one that has it, so a listing
 * doesn't turn ragged, and the gap is visible enough to be noticed and
 * filled. It reuses the 35mm perforation motif, which is the site's
 * existing way of saying "film".
 *
 * `<img>` rather than `next/image`. The source is a redirect resolved per
 * request (see the note on the route), so there is no stable upstream URL
 * for the optimizer to key a cache on, and the Notion S3 host would have
 * to be whitelisted in next.config for a URL that changes every hour. The
 * body renderer already makes the same call for the same reason.
 */
export function PostCover({
  post,
  emptyLabel,
  className = "aspect-[16/9]",
}: {
  post: BlogPost;
  emptyLabel: string;
  className?: string;
}) {
  if (!post.cover) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center gap-3 border-b border-border bg-bg`}
      >
        <div className="filmstrip-rule w-24 opacity-60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {emptyLabel}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={coverProxyPath(post.id)}
      alt=""
      loading="lazy"
      className={`${className} w-full border-b border-border object-cover`}
    />
  );
}
