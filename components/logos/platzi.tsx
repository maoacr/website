/**
 * The Platzi icon, in Platzi's own green.
 *
 * Inlined rather than served as a file: it is well under a kilobyte, so a
 * separate request would cost more than the bytes it saves.
 *
 * It takes `currentColor` so the colour lives in CSS beside CUN's, where
 * both can follow the same rule: full brand colour on light, white on
 * dark. The green measures 1.46:1 against the light ground on its own,
 * which is why the dark theme knocks it out rather than keeping it.
 * See `.logo-platzi` in globals.css.
 */
export function PlatziMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M10.64 1.127L2.487 9.282a3.842 3.842 0 000 5.436l8.155 8.155a3.842 3.842 0 005.436 0l2.719-2.718-2.719-2.718-2.718 2.718L5.204 12l8.155-8.155 5.437 5.437-5.437 5.436 2.718 2.719L21.514 12a3.842 3.842 0 000-5.437l-5.448-5.436a3.828 3.828 0 00-5.425 0Z" />
    </svg>
  );
}
