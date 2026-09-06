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
      // Clicking the backdrop closes. The dialog element itself is the
      // full-viewport box, so a click landing on it rather than on the
      // panel inside means the backdrop was hit.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-label={copy.title}
      className="max-h-[85svh] w-[min(46rem,92vw)] overflow-y-auto rounded-2xl border border-border bg-transparent p-0 text-fg backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="glass">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={project.image}
            alt={copy.title}
            fill
            sizes="(min-width: 768px) 46rem, 92vw"
            className="object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg/80 text-fg backdrop-blur-sm transition-colors hover:border-signal hover:text-signal"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
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
