import Link from "next/link";
import type { BlogPost } from "@/lib/notion/types";
import type { Locale } from "@/lib/i18n/config";

export function PostCard({
  post,
  locale,
  dateLocale,
}: {
  post: BlogPost;
  locale: Locale;
  dateLocale: string;
}) {
  const formattedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString(dateLocale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-signal/60"
    >
      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
        {post.category && <span className="text-signal">{post.category}</span>}
        {formattedDate && <span>{formattedDate}</span>}
      </div>

      <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-fg group-hover:text-signal">
        {post.title}
      </h3>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {post.author && (
        <p className="mt-4 text-xs text-muted">{post.author}</p>
      )}
    </Link>
  );
}
