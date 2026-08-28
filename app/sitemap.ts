import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo/site";
import { getPublishedPosts } from "@/lib/notion/posts";

// Regenerated on the same cadence as the blog pages, so newly published
// posts show up for crawlers without a redeploy.
export const revalidate = 3600;

function localeAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === "es" ? 1 : 0.9,
      alternates: localeAlternates(""),
    },
    {
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: localeAlternates("/blog"),
    },
  ]);

  // Notion is a third-party network dependency. A sitemap is important,
  // but not important enough to fail the entire production build over —
  // if Notion is down or rate-limiting at build time, ship the static
  // routes rather than shipping nothing.
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const perLocale = await Promise.all(
      locales.map(async (locale) => {
        const posts = await getPublishedPosts(locale);
        return posts.map((post) => ({
          url: `${SITE_URL}/${locale}/blog/${post.slug}`,
          lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }));
      }),
    );
    postRoutes = perLocale.flat();
  } catch (error) {
    console.error("[sitemap] Could not load Notion posts; emitting static routes only.", error);
  }

  return [...staticRoutes, ...postRoutes];
}
