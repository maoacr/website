"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => void;
};

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();
  const buttonRef = useRef<HTMLButtonElement>(null);

  function toggleTheme() {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const doc = document as DocumentWithViewTransition;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!doc.startViewTransition || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    doc.startViewTransition(() => {
      setTheme(next);
    });
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg transition-colors hover:border-signal hover:text-signal"
    >
      {mounted && resolvedTheme === "dark" ? (
        <Sun size={16} strokeWidth={1.75} />
      ) : (
        <Moon size={16} strokeWidth={1.75} />
      )}
    </button>
  );
}
