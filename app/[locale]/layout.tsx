import type { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SITE_URL,
  SITE_NAME,
  AUTHOR_NAME,
  AUTHOR_SHORT_NAME,
  AUTHOR_EMAIL,
  AUTHOR_LINKEDIN,
  HTML_LANG,
  OG_LOCALE,
} from "@/lib/seo/site";

// Self-hosted variable fonts (OFL-licensed, from google/fonts) instead of
// next/font/google — no runtime call to fonts.googleapis.com, so the site
// keeps working behind strict network policies and ships one less
// third-party request.
const archivo = localFont({
  src: "../../assets/fonts/archivo.ttf",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
});

const inter = localFont({
  src: "../../assets/fonts/inter.ttf",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../../assets/fonts/jetbrainsmono.ttf",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

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
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: `%s — ${SITE_NAME}`,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    applicationName: SITE_NAME,
    authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
    creator: AUTHOR_NAME,
    publisher: AUTHOR_NAME,
    category: "technology",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      // Tells crawlers the same content exists in the other language, so
      // the two locales reinforce each other instead of competing.
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    // iOS Safari otherwise turns anything that *looks* like a phone number
    // (dates, version strings, timecodes) into a tel: link.
    formatDetection: { telephone: false, address: false, email: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const dict = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        alternateName: AUTHOR_SHORT_NAME,
        jobTitle: "Software Engineer",
        email: AUTHOR_EMAIL,
        url: SITE_URL,
        image: `${SITE_URL}/${locale}/opengraph-image`,
        sameAs: [AUTHOR_LINKEDIN],
        nationality: { "@type": "Country", name: "Colombia" },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Fusagasugá",
          addressRegion: "Cundinamarca",
          addressCountry: "CO",
        },
        knowsAbout: [
          "React",
          "Next.js",
          "JavaScript",
          "TypeScript",
          "UX/UI Design",
          "Clean Code",
          "SOLID",
        ],
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "CUN" },
          { "@type": "EducationalOrganization", name: "Platzi" },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: [HTML_LANG[locale]],
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <html
      lang={HTML_LANG[locale]}
      suppressHydrationWarning
      className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body
        id="top"
        className="flex min-h-dvh flex-col bg-bg text-fg selection:bg-signal"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
