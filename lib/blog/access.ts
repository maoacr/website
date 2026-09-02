import "server-only";
import { cookies } from "next/headers";
import { getPostPassword } from "@/lib/notion/posts";
import { secretsMatch, signAccess, tokenIsValid } from "./token.ts";

function cookieName(postId: string): string {
  // Notion ids contain dashes, which are legal in a cookie name.
  return `post_access_${postId}`;
}

/** True when the submitted password matches the post's stored one. */
export async function passwordMatches(postId: string, submitted: string): Promise<boolean> {
  const stored = await getPostPassword(postId);
  if (!stored) return false;
  return secretsMatch(submitted, stored);
}

/** True when this visitor holds an unexpired unlock for the post. */
export async function hasAccess(postId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName(postId))?.value;
  if (!token) return false;

  const stored = await getPostPassword(postId);
  if (!stored) return false;

  return tokenIsValid(postId, stored, token);
}

export async function grantAccess(postId: string, password: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(cookieName(postId), signAccess(postId, password, Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // No `maxAge` and no `expires`: this is a session cookie, so the
    // browser discards it when it closes. ACCESS_TTL_MS in token.ts is
    // the backstop for browsers that restore sessions anyway.
  });
}
