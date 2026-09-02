import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * How long an unlock stays valid, enforced by the server.
 *
 * This is the second of two layers. The cookie itself is a *session*
 * cookie (no `maxAge`), so the browser normally drops it when it closes —
 * but that alone can't be trusted: "continue where you left off" and
 * session-restore features in Chrome, Firefox and Safari routinely bring
 * session cookies back after a restart. The expiry below is baked into
 * the signed token, so a restored cookie is still refused once it ages
 * out, no matter what the browser chose to keep.
 */
export const ACCESS_TTL_MS = 15 * 60 * 1000;

/**
 * The proof-of-access value stored in the visitor's cookie.
 *
 * A cookie is client-controlled data: `httpOnly` stops page scripts from
 * reading it, but nothing stops someone crafting a request with any
 * cookie they like. So the value can't be a flag like "true" — it has to
 * be something only the server can produce.
 *
 * It's an HMAC of the post id and an issue timestamp, keyed by that
 * post's own password. Keying on the password (instead of a separate app
 * secret) has two benefits: there's no extra env var to provision, and
 * changing the password in Notion instantly invalidates every cookie
 * already handed out for that post, which is exactly what you want from
 * a rotate.
 *
 * The timestamp is inside the signed payload rather than merely sitting
 * next to it, so it can't be edited to extend a session — changing it
 * breaks the signature.
 */
export function signAccess(postId: string, password: string, issuedAt: number): string {
  const signature = createHmac("sha256", password)
    .update(`${postId}.${issuedAt}`)
    .digest("hex");
  return `${issuedAt}.${signature}`;
}

/** Constant-time compare of two arbitrary-length secrets. */
export function secretsMatch(a: string, b: string): boolean {
  // `timingSafeEqual` throws on length mismatch, and the lengths of the
  // two inputs would themselves leak through that. Hashing first makes
  // both sides a fixed 32 bytes regardless of input length.
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

/**
 * Whether a cookie value is a currently-valid unlock for this post.
 *
 * Kept free of Next.js and Notion imports so the security-critical part
 * can be exercised directly — see scripts/verify-access-token.ts.
 */
export function tokenIsValid(
  postId: string,
  password: string,
  token: string,
  now: number = Date.now(),
): boolean {
  const issuedAt = Number(token.split(".")[0]);
  if (!Number.isFinite(issuedAt)) return false;

  // Checked before the signature so an expired token costs no Notion
  // round-trip. A forged timestamp fails the signature check below
  // anyway, since the timestamp is part of the signed payload.
  const age = now - issuedAt;
  if (age < 0 || age > ACCESS_TTL_MS) return false;

  return secretsMatch(token, signAccess(postId, password, issuedAt));
}
