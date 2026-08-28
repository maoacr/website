import { ImageResponse } from "next/og";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_URL } from "@/lib/seo/site";

// Next's file-based convention: this replaces the `/og-image.png` that the
// metadata used to point at but that never existed in /public — every
// share of this site currently renders with no preview image at all.
// Generating it means the card can never drift out of sync with the copy,
// and it stays correct per locale.
export const alt = "Mario Crespo — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens, duplicated as literals on purpose: this renders through
// Satori, which resolves neither CSS custom properties nor Tailwind
// classes — it only understands inline styles with concrete values.
const GRAPHITE = "#0a0a0c";
const FOG = "#e8e7e2";
const SIGNAL = "#ff4520";
const MUTED = "#97968f";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "es";
  const dict = getDictionary(locale);

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
              width: 14,
              height: 14,
              borderRadius: 999,
              background: SIGNAL,
              marginRight: 16,
            }}
          />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: SIGNAL,
            }}
          >
            {dict.hero.rec}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: 24,
            }}
          >
            {dict.hero.slugline}
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.05,
              color: FOG,
              letterSpacing: -2,
            }}
          >
            Mario Crespo
          </div>
          <div style={{ fontSize: 38, color: MUTED, marginTop: 20 }}>
            {dict.hero.kicker}
          </div>
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
          <div style={{ fontSize: 28, color: FOG, letterSpacing: 1 }}>
            {SITE_URL.replace("https://", "")}
          </div>
          <div style={{ fontSize: 26, color: MUTED, letterSpacing: 2 }}>
            {dict.contact.location}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
