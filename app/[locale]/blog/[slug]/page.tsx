import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPostBySlug } from "@/lib/notion/posts";
import { getPageBlocks } from "@/lib/notion/blocks";
import { deriveExcerpt } from "@/lib/notion/excerpt";
import { SITE_URL, SITE_NAME, AUTHOR_NAME, OG_LOCALE, HTML_LANG } from "@/lib/seo/site";
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

/**
 * The summary shown in search results and on social cards: the Notion
 * Excerpt column if the database has one, otherwise the opening of the
 * post itself. Both reads are `cache()`d, so this costs no extra Notion
 * calls beyond what rendering the page already does.
 */
async function resolveDescription(
  post: { id: string; excerpt: string | null },
  fallback: string,
): Promise<string> {
  if (post.excerpt) return post.excerpt;
  const blocks = await getPageBlocks(post.id);
  return deriveExcerpt(blocks) ?? fallback;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const resolved = await resolvePost(rawLocale, slug);
  if (!resolved) return {};

  const { locale, post } = resolved;
  const dict = getDictionary(locale);
  const description = await resolveDescription(post, dict.blog.metaDescription);
  const url = `${SITE_URL}/${locale}/blog/${slug}`;

  return {
    title: post.title,
    description,
    authors: [{ name: post.author ?? AUTHOR_NAME }],
    // Tags double as page-level keywords; the category is the section.
    keywords: post.tags.length > 0 ? post.tags : undefined,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      // NOTE: each Notion row is a single-language post with its own
      // id-derived slug, so a post has no counterpart URL in the other
      // locale to point `hreflang` at. Only the language this post is
      // actually written in is declared. If the ES/EN posts are ever
      // merged into one row (see the toggle model discussed), this is
      // where the sibling URLs would go.
      languages: { [locale]: `/${locale}/blog/${slug}` },
    },
    openGraph: {
      // "article" (not "website") is what unlocks published-time, author
      // and tag rendering in social previews and Google's article results.
      type: "article",
      title: post.title,
      description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      publishedTime: post.publishedDate ?? undefined,
      authors: [post.author ?? AUTHOR_NAME],
      section: post.category ?? undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
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
  const description = await resolveDescription(post, dict.blog.metaDescription);

  const formattedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString(dict.blog.dateLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const url = `${SITE_URL}/${locale}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        headline: post.title,
        description,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        datePublished: post.publishedDate ?? undefined,
        dateModified: post.publishedDate ?? undefined,
        inLanguage: HTML_LANG[locale],
        articleSection: post.category ?? undefined,
        keywords: post.tags.length > 0 ? post.tags.join(", ") : undefined,
        image: `${url}/opengraph-image`,
        author: post.author
          ? { "@type": "Person", name: post.author }
          : { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/${locale}/blog#blog` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}/${locale}` },
          {
            "@type": "ListItem",
            position: 2,
            name: dict.blog.metaTitle,
            item: `${SITE_URL}/${locale}/blog`,
          },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
