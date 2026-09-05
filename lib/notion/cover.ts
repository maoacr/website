/**
 * The stable URL for a post's cover.
 *
 * Not the Notion URL: that one carries a one-hour signature and would rot
 * inside cached HTML. This path never changes, and the route behind it
 * resolves a fresh signature per request — see app/api/cover/[postId].
 *
 * Safe to import from client components; it builds a string and touches
 * neither Notion nor the filesystem.
 */
export function coverProxyPath(postId: string): string {
  return `/api/cover/${postId}`;
}
