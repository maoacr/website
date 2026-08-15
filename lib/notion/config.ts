import "server-only";

// Fail fast, at import time, instead of surfacing a cryptic 401/undefined
// error deep inside a Server Component during a request. Mirrors how
// SITE_URL is treated as a required constant elsewhere in the app.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing "${name}" in .env.local — required to query the Notion blog database.`,
    );
  }
  return value;
}

export const NOTION_API_KEY = requireEnv("NOTION_API_KEY");
export const NOTION_DATABASE_ID = requireEnv("NOTION_DATABASE_ID");

// NOTE: the ISR revalidate window (1h) is NOT defined here as a shared
// constant. Next.js's route segment config (`export const revalidate`)
// must be a literal it can read statically, without executing the module —
// an imported value fails with "Invalid segment configuration export".
// The literal `3600` is duplicated in both
// app/[locale]/blog/page.tsx and app/[locale]/blog/[slug]/page.tsx —
// keep them in sync if you change the window.
