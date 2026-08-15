import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPostBySlug } from "@/lib/notion/posts";
import { getPageBlocks } from "@/lib/notion/blocks";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { NotionBlockRenderer } from "@/components/blog/notion-block-renderer";

// Must be a literal, not an import — see the same note in ../page.tsx.
// Keep this in sync with that file's revalidate value.
export const revalidate = 3600;

async function resolvePost(rawLocale: string, slug: string) {
  if (!isLocale(rawLocale)) return null;
  const locale: Locale = rawLocale;
  const post = await getPostBySlug(locale, slug);
  return post ? { locale, post } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const resolved = await resolvePost(rawLocale, slug);
  if (!resolved) return {};

  return {
    title: resolved.post.title,
    description: resolved.post.category ?? undefined,
    alternates: { canonical: `/${resolved.locale}/blog/${slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const resolved = await resolvePost(rawLocale, slug);
  if (!resolved) notFound();
  const { locale, post } = resolved;
  const dict = getDictionary(locale);

  const blocks = await getPageBlocks(post.id);

  const formattedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString(dict.blog.dateLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <SiteNav locale={locale} dict={dict} />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-32 sm:px-8">
        <Link
          href={`/${locale}/blog`}
          className="font-mono text-xs uppercase tracking-wider text-muted hover:text-signal"
        >
          ← {dict.blog.back}
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
            {post.category && <span className="text-signal">{post.category}</span>}
            {formattedDate && <span>{formattedDate}</span>}
            {post.author && <span>{post.author}</span>}
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
            {post.title}
          </h1>
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
        </header>

        <article className="mt-10">
          <NotionBlockRenderer blocks={blocks} />
        </article>
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
