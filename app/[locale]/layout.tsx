import type { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ThemeProvider } from "@/components/theme-provider";

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

const SITE_URL = "https://maoacr.com";

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
      template: `%s — Mario Crespo`,
    },
    description: dict.meta.description,
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
      siteName: "Mario Crespo",
      locale: locale === "es" ? "es_CO" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Mario Alejandro Crespo Reyes",
        alternateName: "Mao Crespo",
        jobTitle: "Software Engineer",
        email: "iam@maoacr.com",
        url: SITE_URL,
        image: `${SITE_URL}/og-image.png`,
        sameAs: ["https://linkedin.com/in/maoacr"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Fusagasugá",
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
        name: "Mario Crespo — Software Engineer",
        inLanguage: [locale === "es" ? "es-CO" : "en-US"],
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${archivo.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body id="top" className="min-h-full bg-bg text-fg selection:bg-signal">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
