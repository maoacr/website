"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n/config";
import { unlockPost, type UnlockState } from "@/app/[locale]/blog/[slug]/actions";

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl border border-signal bg-signal px-5 py-3 font-mono text-xs uppercase tracking-wider text-white transition-opacity disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function PasswordGate({
  locale,
  slug,
  title,
  description,
  placeholder,
  submitLabel,
  pendingLabel,
  errorLabel,
}: {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  placeholder: string;
  submitLabel: string;
  pendingLabel: string;
  errorLabel: string;
}) {
  const [state, formAction] = useActionState<UnlockState, FormData>(unlockPost, {
    error: false,
  });

  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <h1 className="font-display text-2xl font-semibold text-fg">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>

      <form action={formAction} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="slug" value={slug} />
        <input
          type="password"
          name="password"
          required
          autoComplete="off"
          placeholder={placeholder}
          aria-invalid={state.error}
          aria-describedby={state.error ? "unlock-error" : undefined}
          className="flex-1 rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-muted focus:border-signal"
        />
        <SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
      </form>

      {state.error && (
        <p id="unlock-error" role="alert" className="mt-3 text-sm text-signal">
          {errorLabel}
        </p>
      )}
    </div>
  );
}
