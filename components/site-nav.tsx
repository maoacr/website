import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { AUTHOR_HANDLE, AUTHOR_SHORT_NAME } from "@/lib/seo/site";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitch } from "./locale-switch";
import { NavReveal } from "./nav-reveal";

export function SiteNav({
  locale,
  dict,
  localeSwitchHref,
  revealOnScroll = false,
}: {
  locale: Locale;
  dict: Dictionary;
  /** Passed through to LocaleSwitch — see the note on its `href` prop. */
  localeSwitchHref?: string;
  /**
   * Hold the nav back until the first scroll. Opt-in rather than the
   * default: only the home page has a cold open worth keeping clear. On
   * the blog there is nothing to protect, and a nav that starts invisible
   * would just be a missing nav.
   */
  revealOnScroll?: boolean;
}) {
  const header = (
    /* Floating capsule rather than a full-bleed bar. The outer padding
       matches the sections' own `px-4 sm:px-8`, so the capsule's edges land
       on the same vertical line as the content underneath it instead of
       floating at an arbitrary inset. `rounded-full` because the site's
       controls are all `rounded-full` — the nav now reads as one of them.
       Total occupied height stays ~64px, so the pages' existing top padding
       still clears it. */
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-8 sm:pt-4">
      <div className="nav-glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-border/60 px-5 sm:px-7">
        {/* Wordmark. `mao` leads because that is what people actually call
            him, what the domain says and what every handle resolves to —
            the previous "M. CRESPO." was the one spelling appearing
            nowhere else on the site. The handle sits beside it at lower
            contrast and smaller size rather than on a second line, so the
            lockup stays one horizontal unit when the symbol from the
            brand work lands to its left. */}
        <Link
          href={`/${locale}`}
          className="group flex items-baseline gap-2 font-mono tracking-tight"
          aria-label={`${AUTHOR_SHORT_NAME} — ${AUTHOR_HANDLE}`}
        >
          <span className="text-sm font-medium text-fg">
            mao<span className="text-signal">.</span>
          </span>
          <span className="hidden text-[11px] text-muted transition-colors group-hover:text-signal sm:inline">
            {AUTHOR_HANDLE}
          </span>
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
          <LocaleSwitch
            locale={locale}
            label={dict.nav.switchLocale}
            href={localeSwitchHref}
          />
          <ThemeToggle label={dict.nav.switchTheme} />
        </div>
      </div>
    </header>
  );

  return revealOnScroll ? <NavReveal>{header}</NavReveal> : header;
}
