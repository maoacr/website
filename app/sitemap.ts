import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo/site";
import { getPublishedPosts } from "@/lib/notion/posts";
import type { BlogPost } from "@/lib/notion/types";

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

/**
 * Notion is a third-party network dependency. A sitemap is important, but
 * not important enough to fail a production build over — if Notion is
 * down or rate-limiting, emit the static routes rather than nothing.
 */
async function loadPostsByLocale(): Promise<Partial<Record<Locale, BlogPost[]>>> {
  try {
    const entries = await Promise.all(
      locales.map(async (locale) => [locale, await getPublishedPosts(locale)] as const),
    );
    return Object.fromEntries(entries);
  } catch (error) {
    console.error("[sitemap] Could not load Notion posts; emitting static routes only.", error);
    return {};
  }
}

/** Most recent publication date in a set, or null when none is dated. */
function newestPublishedDate(posts: BlogPost[]): Date | null {
  const timestamps = posts
    .map((post) => (post.publishedDate ? new Date(post.publishedDate).getTime() : NaN))
    .filter((time) => !Number.isNaN(time));
  return timestamps.length > 0 ? new Date(Math.max(...timestamps)) : null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetched before the static routes are built because the blog listing's
  // `lastModified` is derived from the newest post in it.
  const postsByLocale = await loadPostsByLocale();

  // `lastModified` is deliberately OMITTED where we can't state it
  // truthfully, rather than defaulted to `new Date()`.
  //
  // This route revalidates hourly, so `new Date()` would claim the home
  // page changed an hour ago — every hour, forever, whether or not
  // anything actually changed. Google only honours `lastmod` while it
  // proves accurate against real content changes; feed it noise and it
  // discards the signal for the whole site, including the blog posts
  // below, where the date IS real. Saying nothing beats saying something
  // false.
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => {
    const newestPost = newestPublishedDate(postsByLocale[locale] ?? []);
    return [
      {
        url: `${SITE_URL}/${locale}`,
        changeFrequency: "monthly" as const,
        priority: locale === "es" ? 1 : 0.9,
        alternates: localeAlternates(""),
      },
      {
        url: `${SITE_URL}/${locale}/blog`,
        // The listing genuinely changes when a new post lands, so the
        // newest post's date is an honest answer here.
        ...(newestPost ? { lastModified: newestPost } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: localeAlternates("/blog"),
      },
    ];
  });

  const postRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    (postsByLocale[locale] ?? []).map((post) => ({
      url: `${SITE_URL}/${locale}/blog/${post.slug}`,
      // Same rule: an undated post reports no date at all.
      ...(post.publishedDate ? { lastModified: new Date(post.publishedDate) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticRoutes, ...postRoutes];
}
