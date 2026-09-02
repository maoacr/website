import { ImageResponse } from "next/og";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPostBySlug } from "@/lib/notion/posts";
import { SITE_URL, AUTHOR_NAME } from "@/lib/seo/site";

export const alt = "Mario Crespo — Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same cadence as the post pages, so a retitled post doesn't keep serving
// a stale card.
export const revalidate = 3600;

// See the note in app/[locale]/opengraph-image.tsx — Satori needs literal
// values, not CSS variables or Tailwind classes.
const GRAPHITE = "#0a0a0c";
const FOG = "#e8e7e2";
const SIGNAL = "#ff4520";
const MUTED = "#97968f";

export default async function BlogPostOpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "es";
  const dict = getDictionary(locale);
  const post = await getPostBySlug(locale, slug);

  // A protected post's card is generic. This image is served without any
  // cookie check — it has to be, since social crawlers can't authenticate
  // — so rendering the real title here would publish it to anyone who
  // requests the image URL directly.
  const isLocked = post?.isProtected ?? false;

  const title = isLocked ? dict.blog.locked.title : (post?.title ?? dict.blog.metaTitle);
  const formattedDate =
    post?.publishedDate && !isLocked
      ? new Date(post.publishedDate).toLocaleDateString(dict.blog.dateLocale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  // Long headlines have to shrink or they overflow the card — Satori has
  // no text-fitting of its own, so the size is chosen up front.
  const titleFontSize = title.length > 80 ? 54 : title.length > 45 ? 68 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: GRAPHITE,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: SIGNAL,
            }}
          >
            {isLocked
              ? dict.blog.locked.slugline
              : (post?.category ?? dict.blog.metaTitle)}
          </div>
          {formattedDate && (
            <div style={{ fontSize: 24, color: MUTED, marginLeft: 24 }}>
              {formattedDate}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.1,
            color: FOG,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${SIGNAL}`,
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 28, color: FOG }}>
            {isLocked ? AUTHOR_NAME : (post?.author ?? AUTHOR_NAME)}
          </div>
          <div style={{ fontSize: 26, color: MUTED, letterSpacing: 2 }}>
            {SITE_URL.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
