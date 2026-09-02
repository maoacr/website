import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getPostPassword } from "@/lib/notion/posts";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 12;

function cookieName(postId: string): string {
  // Notion ids contain dashes, which are legal in a cookie name.
  return `post_access_${postId}`;
}

/**
 * The proof-of-access value stored in the visitor's cookie.
 *
 * A cookie is client-controlled data: `httpOnly` stops page scripts from
 * reading it, but nothing stops someone crafting a request with any
 * cookie they like. So the value can't be a flag like "true" — it has to
 * be something only the server can produce.
 *
 * It's an HMAC of the post id keyed by that post's own password. Keying
 * on the password (instead of a separate app secret) has two benefits:
 * there's no extra env var to provision, and changing the password in
 * Notion instantly invalidates every cookie already handed out for that
 * post, which is exactly what you want from a rotate.
 */
function signAccess(postId: string, password: string): string {
  return createHmac("sha256", password).update(postId).digest("hex");
}

/** Constant-time compare of two arbitrary-length secrets. */
function secretsMatch(a: string, b: string): boolean {
  // `timingSafeEqual` throws on length mismatch, and the lengths of the
  // two inputs would themselves leak through that. Hashing first makes
  // both sides a fixed 32 bytes regardless of input length.
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

/** True when the submitted password matches the post's stored one. */
export async function passwordMatches(postId: string, submitted: string): Promise<boolean> {
  const stored = await getPostPassword(postId);
  if (!stored) return false;
  return secretsMatch(submitted, stored);
}

/** True when this visitor already unlocked the post in this browser. */
export async function hasAccess(postId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName(postId))?.value;
  if (!token) return false;

  const stored = await getPostPassword(postId);
  if (!stored) return false;

  return secretsMatch(token, signAccess(postId, stored));
}

export async function grantAccess(postId: string, password: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(cookieName(postId), signAccess(postId, password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}
