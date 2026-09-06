/**
 * The Platzi icon, as a single monochrome path.
 *
 * Inlined rather than served as a file: it is well under a kilobyte, so a
 * separate request would cost more than the bytes it saves, and inlining
 * is what lets it take `currentColor` and follow the theme without a
 * second asset for dark mode.
 *
 * Recolouring someone else's mark normally breaks their brand guidelines.
 * This is the exception that proves it: the icon's own single-colour form
 * exists precisely to be set in one colour, so following the theme is the
 * intended use rather than a liberty.
 */
export function PlatziMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M10.64 1.127L2.487 9.282a3.842 3.842 0 000 5.436l8.155 8.155a3.842 3.842 0 005.436 0l2.719-2.718-2.719-2.718-2.718 2.718L5.204 12l8.155-8.155 5.437 5.437-5.437 5.436 2.718 2.719L21.514 12a3.842 3.842 0 000-5.437l-5.448-5.436a3.828 3.828 0 00-5.425 0Z" />
    </svg>
  );
}
