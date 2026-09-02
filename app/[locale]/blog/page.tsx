import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublicPosts } from "@/lib/notion/posts";
import { SITE_URL, SITE_NAME, AUTHOR_NAME, OG_LOCALE, HTML_LANG } from "@/lib/seo/site";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { SceneHeading } from "@/components/scene-heading";
import { BlogSearch } from "@/components/blog/blog-search";

// ISR, not a webhook: this personal blog doesn't need real-time push from
// Notion. A refetch window this size is invisible in practice and needs
// no public endpoint or webhook secret to maintain.
// Must be a literal — Next.js reads route segment config statically,
// without executing the module, so an imported constant fails the build
// ("Invalid segment configuration export"). Keep in sync with the same
// literal in app/[locale]/blog/[slug]/page.tsx.
export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "es";
  const dict = getDictionary(locale);

  return {
    title: dict.blog.metaTitle,
    description: dict.blog.metaDescription,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}/blog`])),
        "x-default": "/es/blog",
      },
    },
    openGraph: {
      title: `${dict.blog.metaTitle} — ${SITE_NAME}`,
      description: dict.blog.metaDescription,
      url: `${SITE_URL}/${locale}/blog`,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.blog.metaTitle} — ${SITE_NAME}`,
      description: dict.blog.metaDescription,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);

  // Two filters, both server-side, both for the same reason: this array is
  // handed to <BlogSearch>, a client component, so every field of every
  // post here is delivered to the visitor's browser.
  //   - Draft/In Review/Archived: excluded in the Notion query itself.
  //   - Password-protected: excluded by getPublicPosts.
  // Filtering in the UI instead would ship the titles and excerpts anyway.
  const posts = await getPublicPosts(locale);

  // Blog + Breadcrumb structured data. The Blog node links every post back
  // to the same Person as the site root (`#person`), so Google reads the
  // portfolio and the writing as one identity rather than two unrelated
  // entities that happen to share a domain.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/${locale}/blog#blog`,
        url: `${SITE_URL}/${locale}/blog`,
        name: `${dict.blog.metaTitle} — ${SITE_NAME}`,
        description: dict.blog.metaDescription,
        inLanguage: HTML_LANG[locale],
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          "@id": `${SITE_URL}/${locale}/blog/${post.slug}#post`,
          headline: post.title,
          url: `${SITE_URL}/${locale}/blog/${post.slug}`,
          datePublished: post.publishedDate ?? undefined,
          author: { "@type": "Person", name: post.author ?? AUTHOR_NAME },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: dict.blog.metaTitle,
            item: `${SITE_URL}/${locale}/blog`,
          },
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
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-8">
        <SceneHeading slugline={dict.blog.slugline} title={dict.blog.title}>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            {dict.blog.subtitle}
          </p>
        </SceneHeading>

        <BlogSearch
          posts={posts}
          locale={locale}
          dateLocale={dict.blog.dateLocale}
          placeholder={dict.blog.searchPlaceholder}
          emptyLabel={dict.blog.empty}
        />
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
