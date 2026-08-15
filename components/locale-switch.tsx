"use client";

import { useRouter, usePathname } from "next/navigation";
import { startTransition } from "react";
import type { Locale } from "@/lib/i18n/config";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => void;
};

export function LocaleSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale() {
    const target = locale === "es" ? "en" : "es";
    const rest = pathname.replace(/^\/(es|en)/, "");
    const nextPath = `/${target}${rest || ""}`;

    const doc = document as DocumentWithViewTransition;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!doc.startViewTransition || prefersReducedMotion) {
      router.push(nextPath);
      return;
    }

    doc.startViewTransition(() => {
      return new Promise<void>((resolve) => {
        startTransition(() => {
          router.push(nextPath);
          resolve();
        });
      });
    });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={label}
      title={label}
      className="rounded-full border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-fg transition-colors hover:border-signal hover:text-signal"
    >
      {locale === "es" ? "ES / en" : "es / EN"}
    </button>
  );
}
