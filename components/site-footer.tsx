import type { Dictionary } from "@/lib/i18n/dictionaries";
import { AUTHOR_NAME } from "@/lib/seo/site";

/**
 * The closing credits.
 *
 * If the site opens on a cold open and runs in scenes, it has to end the
 * way a film ends. The previous footer said "all rights reserved" and
 * nothing else — the only surface on the site not speaking the concept's
 * language.
 *
 * "Fin." is set in the monospace rather than the display face on purpose:
 * a screenplay ends in a typewriter, and the blinking caret is the same
 * one that opens the page in the cold open. The site is bookended by
 * someone typing.
 *
 * Deliberately still a server component. A scroll reveal here would mean
 * making it a client component and serialising the whole dictionary to the
 * browser for one animation; the caret carries the life at no cost.
 */
export function SiteFooter({ dict }: { dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-12 pt-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="filmstrip-rule max-w-full" />

        {/* Centred, unlike everything else on the site. An end card is
            centred, and the break is what marks this as the close rather
            than one more section. */}
        <p className="mt-14 text-center font-mono text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          {dict.footer.end}
          <span className="caret-blink ml-1 inline-block h-[0.8em] w-[0.45ch] translate-y-[0.06em] bg-signal align-baseline" />
        </p>

        <dl className="mx-auto mt-16 grid max-w-xl gap-x-8 gap-y-3 sm:grid-cols-[auto_1fr]">
          {dict.footer.credits.map((credit) => (
            <div key={credit.label} className="contents">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:text-right">
                {credit.label}
              </dt>
              <dd className="font-mono text-xs uppercase tracking-wider text-fg">
                {credit.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-wider text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {AUTHOR_NAME} — {dict.footer.rights}
          </p>
          <a href="#top" className="transition-colors hover:text-signal">
            {dict.footer.backToTop} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
