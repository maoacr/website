"use client";

import { useMemo, useState } from "react";
import type { BlogPost } from "@/lib/notion/types";
import type { Locale } from "@/lib/i18n/config";
import { PostCard } from "./post-card";

export function BlogSearch({
  posts,
  locale,
  dateLocale,
  placeholder,
  emptyLabel,
}: {
  posts: BlogPost[];
  locale: Locale;
  dateLocale: string;
  placeholder: string;
  emptyLabel: string;
}) {
  const [query, setQuery] = useState("");

  // The whole published list for this locale is already on the page (it's
  // a personal blog, not a magazine) — filtering in memory as the user
  // types is instant and needs zero extra requests or search infra.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) => {
      const haystack = [post.title, post.category, post.author, ...post.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-muted focus:border-signal"
      />

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">{emptyLabel}</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} dateLocale={dateLocale} />
          ))}
        </div>
      )}
    </div>
  );
}
