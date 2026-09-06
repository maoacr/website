"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Project } from "@/lib/data/projects";
import type { Locale } from "@/lib/i18n/config";

/**
 * The full record for one project.
 *
 * Built on the native `<dialog>` rather than a hand-rolled overlay, which
 * hands over four things that are tedious and easy to get wrong: Escape to
 * close, focus kept inside while open and returned to the trigger after,
 * the rest of the page inerted for assistive tech, and rendering in the
 * top layer — above every stacking context on the page, so no z-index
 * negotiation and no risk of an ancestor's `opacity` or `transform`
 * quietly capturing it.
 *
 * The back button closes it too. Without that, on a phone the instinctive
 * gesture for "go back" leaves the site entirely, which is a worse outcome
 * than any modal is worth. A single history entry is enough — no routing.
 */
export function ProjectModal({
  project,
  locale,
  open,
  onClose,
  closeLabel,
}: {
  project: Project;
  locale: Locale;
  open: boolean;
  onClose: () => void;
  closeLabel: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const copy = project[locale];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      // The page behind must not scroll while a modal is over it.
      document.body.style.overflow = "hidden";
      window.history.pushState({ projectModal: project.slug }, "");

      const onPop = () => onClose();
      window.addEventListener("popstate", onPop);
      return () => {
        window.removeEventListener("popstate", onPop);
        document.body.style.overflow = "";
      };
    }

    if (dialog.open) dialog.close();
  }, [open, project.slug, onClose]);

  return (
    <dialog
      ref={ref}
      // `close` fires for Escape and for `dialog.close()` alike, so this is
      // the single place the parent's state gets told the modal went away.
      onClose={onClose}
      // Clicking the backdrop closes. A click on the ::backdrop pseudo
      // element is retargeted to the dialog itself, so the dialog being the
      // event target — rather than anything inside the panel — means the
      // backdrop was hit.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-label={copy.title}
      /* `m-auto` is load-bearing, not a tidy-up. A modal <dialog> is not
         centred by any layout of ours: the UA stylesheet pins it with
         `inset: 0` and centres it with `margin: auto`. Tailwind's Preflight
         resets `margin: 0` on `*`, which deletes exactly that — and the
         dialog collapses into the top-left corner.

         `max-w` duplicates the width on purpose. The UA also forces
         `max-width: calc(100% - 6px - 2em)` on `dialog:modal`, which would
         otherwise clamp the panel narrower than asked and make the gutter
         an arbitrary ~19px instead of the 16px the rest of the site uses.

         Sizing reads as one expression rather than a breakpoint: on a phone
         the panel is the viewport minus a 1rem gutter each side; past
         ~48rem the 46rem cap takes over and it stops growing, which is the
         measure where the summary still reads as prose. Height matches —
         free to reach the full screen on a phone, capped on a desktop so
         the modal stays legibly a layer above the page. */
      className="m-auto max-h-[calc(100svh-2rem)] w-[min(46rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-transparent p-0 text-fg backdrop:bg-black/50 backdrop:backdrop-blur-sm sm:max-h-[85svh]"
    >
      <div className="glass">
        {/* Zero-height sticky strip so the close button stays put.
            The dialog is the scroll container, and now that the panel can
            reach the full height of a phone screen, a button nested in the
            image would scroll away and leave a full-screen modal with no
            visible way out. Escape and the back gesture still work, but
            neither is discoverable on a touch screen.
            It has to come before the image, not after: `sticky` pins an
            element at its natural position and never lifts it above where
            it starts, so declared later it would sit under the image and
            stay there. `h-0` keeps it out of the flow entirely — it exists
            only to give the button something to hang from. */}
        <div className="sticky top-0 z-10 h-0">
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg/80 text-fg backdrop-blur-sm transition-colors hover:border-signal hover:text-signal"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={project.image}
            alt={copy.title}
            fill
            /* Matches the width expression on the dialog: the panel is the
               viewport minus a 1rem gutter until the 46rem cap bites. */
            sizes="(min-width: 48rem) 46rem, calc(100vw - 2rem)"
            className="object-cover"
          />
        </div>

        <div className="p-7 sm:p-9">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider">
            <span className="text-signal">{copy.role}</span>
            <span className="text-muted tabular-nums">{project.year}</span>
          </div>

          <h2 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
            {copy.title}
          </h2>

          <p className="mt-5 max-w-prose leading-relaxed text-muted">{copy.summary}</p>

          <div className="mt-7 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.links && project.links.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-3 border-t border-border pt-6">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors hover:border-signal hover:text-signal"
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
