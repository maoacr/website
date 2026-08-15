import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitch } from "./locale-switch";

export function SiteNav({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link
          href={`/${locale}`}
          className="font-mono text-sm font-medium tracking-tight text-fg"
        >
          M. CRESPO<span className="text-signal">.</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/blog`}
            className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-signal"
          >
            {dict.blog.navLabel}
          </Link>
          <span className="hidden font-mono text-xs uppercase tracking-wider text-muted sm:inline">
            {dict.nav.role}
          </span>
          <LocaleSwitch locale={locale} label={dict.nav.switchLocale} />
          <ThemeToggle label={dict.nav.switchTheme} />
        </div>
      </div>
    </header>
  );
}
