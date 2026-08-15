import type { Dictionary } from "@/lib/i18n/dictionaries";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-muted sm:flex-row sm:items-center">
        <p>
          © {year} Mario Crespo Reyes — {dict.footer.rights}
        </p>
        <a href="#top" className="transition-colors hover:text-signal">
          {dict.footer.backToTop} ↑
        </a>
      </div>
    </footer>
  );
}
