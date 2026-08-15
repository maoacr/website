import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublishedPosts } from "@/lib/notion/posts";
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

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);

  // Filtered server-side, in the Notion query itself (see lib/notion/posts.ts)
  // — Draft/In Review/Archived posts never leave the server, let alone
  // reach this component's render output.
  const posts = await getPublishedPosts(locale);

  return (
    <>
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
