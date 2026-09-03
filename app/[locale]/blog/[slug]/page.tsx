import Link from "next/link";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPostBySlug, getTranslation } from "@/lib/notion/posts";
import { getPageBlocks } from "@/lib/notion/blocks";
import { deriveExcerpt } from "@/lib/notion/excerpt";
import { SITE_URL, SITE_NAME, AUTHOR_NAME, OG_LOCALE, HTML_LANG } from "@/lib/seo/site";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { NotionBlockRenderer } from "@/components/blog/notion-block-renderer";
import { PasswordGate } from "@/components/blog/password-gate";
import { hasAccess } from "@/lib/blog/access";

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
 *
 * Protected posts never reach the body-derived branch. Deriving would
 * publish the opening lines of a password-protected post into a meta
 * description — readable in the page source without the password, and
 * served straight to crawlers. An explicit `Excerpt` column is still
 * honoured, because that text was written knowingly as a public teaser.
 */
async function resolveDescription(
  post: { id: string; excerpt: string | null; isProtected: boolean },
  fallback: string,
): Promise<string> {
  if (post.excerpt) return post.excerpt;
  if (post.isProtected) return fallback;
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
  const url = `${SITE_URL}/${locale}/blog/${slug}`;

  // A protected post keeps its title (whoever has the link already sees
  // it, and it makes the tab legible) but is kept out of the index: the
  // point of the password is that this isn't for a general audience.
  if (post.isProtected) {
    return {
      title: post.title,
      description: post.excerpt ?? dict.blog.locked.metaDescription,
      robots: { index: false, follow: false },
      alternates: { canonical: `/${locale}/blog/${slug}` },
      openGraph: {
        type: "article",
        title: post.title,
        description: post.excerpt ?? dict.blog.locked.metaDescription,
        url,
        siteName: SITE_NAME,
        locale: OG_LOCALE[locale],
      },
    };
  }

  const description = await resolveDescription(post, dict.blog.metaDescription);

  // Each language is its own Notion row, so a post only has a counterpart
  // URL once the two rows are linked by the translation relation. When
  // they are, declaring both tells Google these are the same article in
  // two languages, and the pair reinforces each other instead of
  // competing as unrelated pages.
  //
  // A protected counterpart is left out on purpose: it is served
  // `noindex`, and pointing hreflang at a page you have asked Google not
  // to index is a contradictory signal.
  const translation = await getTranslation(post);
  const languages: Record<string, string> = {
    [locale]: `/${locale}/blog/${slug}`,
  };
  if (translation && !translation.isProtected) {
    languages[translation.lang] = `/${translation.lang}/blog/${translation.slug}`;
  }

  return {
    title: post.title,
    description,
    authors: [{ name: post.author ?? AUTHOR_NAME }],
    // Tags double as page-level keywords; the category is the section.
    keywords: post.tags.length > 0 ? post.tags : undefined,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages,
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

  // Where the language switch should actually go. Swapping the locale
  // prefix — what it does everywhere else — produces a slug that doesn't
  // exist in the other language and 404s, because each language is a
  // separate Notion row with its own title and id.
  //
  // With the translation linked, it goes to the translated post. Without
  // it, it falls back to that language's blog index: a real page in the
  // language you asked for, rather than a dead end. A counterpart still
  // in Draft resolves to null here, since getTranslation only looks at
  // published posts — an unfinished translation can't leak out this way.
  const otherLocale: Locale = locale === "es" ? "en" : "es";
  const translation = await getTranslation(post);
  const localeSwitchHref = translation
    ? `/${translation.lang}/blog/${translation.slug}`
    : `/${otherLocale}/blog`;

  // The gate runs BEFORE the body is fetched. That ordering is the whole
  // security model: an unauthorised visitor's response is built without
  // the post's content ever being loaded, so there is nothing in the HTML
  // to reveal with "view source" — unlike hiding it with CSS or JS, where
  // the text has already reached the browser.
  if (post.isProtected && !(await hasAccess(post.id))) {
    return (
      <>
        <SiteNav locale={locale} dict={dict} localeSwitchHref={localeSwitchHref} />
        <main className="mx-auto max-w-2xl px-4 pb-24 pt-32 sm:px-8">
          <Link
            href={`/${locale}/blog`}
            className="font-mono text-xs uppercase tracking-wider text-muted hover:text-signal"
          >
            ← {dict.blog.back}
          </Link>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
            {dict.blog.locked.slugline}
          </p>
          <div className="mt-4">
            <PasswordGate
              locale={locale}
              slug={slug}
              title={dict.blog.locked.title}
              description={dict.blog.locked.description}
              placeholder={dict.blog.locked.placeholder}
              submitLabel={dict.blog.locked.submit}
              pendingLabel={dict.blog.locked.pending}
              errorLabel={dict.blog.locked.error}
            />
          </div>
        </main>
        <SiteFooter dict={dict} />
      </>
    );
  }

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
      <SiteNav locale={locale} dict={dict} localeSwitchHref={localeSwitchHref} />
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
