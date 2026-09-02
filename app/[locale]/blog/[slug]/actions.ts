"use server";

import { revalidatePath } from "next/cache";
import { isLocale } from "@/lib/i18n/config";
import { getPostBySlug } from "@/lib/notion/posts";
import { grantAccess, passwordMatches } from "@/lib/blog/access";

export type UnlockState = { error: boolean };

/**
 * Validates a submitted password and, on success, sets the access cookie.
 *
 * The post id is resolved here from the locale/slug rather than accepted
 * from the form: a hidden field is attacker-controlled, and taking one
 * would let a caller aim the check at whichever post they liked.
 */
export async function unlockPost(
  _previous: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const locale = String(formData.get("locale") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!isLocale(locale) || !slug || !password) return { error: true };

  const post = await getPostBySlug(locale, slug);
  if (!post?.isProtected) return { error: true };

  if (!(await passwordMatches(post.id, password))) return { error: true };

  await grantAccess(post.id, password);
  // The page reads cookies, so it renders per request — this just makes
  // the current navigation pick up the new cookie immediately.
  revalidatePath(`/${locale}/blog/${slug}`);
  return { error: false };
}
