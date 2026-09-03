import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { ColdOpen } from "@/components/cold-open";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";
import { ScrollScenes } from "@/components/scroll-scenes";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);

  return (
    <>
      <SiteNav locale={locale} dict={dict} />
      <ScrollScenes />
      <main>
        <ColdOpen dict={dict} />
        <Hero dict={dict} />
        <About dict={dict} />
        <Experience dict={dict} />
        <Projects dict={dict} locale={locale} />
        <Skills dict={dict} />
        <Contact dict={dict} />
      </main>
      <SiteFooter dict={dict} />
    </>
  );
}
