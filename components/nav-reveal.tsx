"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/** Roughly the nav's own height: enough to read as intent, not a trackpad twitch. */
const THRESHOLD_PX = 64;

/**
 * Holds the nav back until the first scroll, then fades it in for good.
 *
 * The cold open is meant to own the screen — a fixed bar across the top of
 * the very first impression competes with it. Once the visitor scrolls, the
 * site has started and the nav belongs there, so it arrives slowly and then
 * stays: scrolling back to the top does not hide it again, because by then
 * it is a tool the visitor knows they have.
 *
 * Two things this has to get right beyond the fade:
 *
 *   - An invisible nav that is still focusable puts keyboard users into
 *     controls they cannot see. `inert` takes it out of the tab order and
 *     the accessibility tree entirely until it is actually shown.
 *   - Reduced motion gets it immediately. The reveal is a flourish;
 *     withholding navigation is a real cost, and trading usability for an
 *     effect is the wrong way round for anyone who asked for less motion.
 */
export function NavReveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  // Derived, not stored: someone who asked for less motion should never see
  // the nav withheld, and expressing that as state would mean an effect
  // setting state on mount just to compute something already known.
  const shown = scrolled || reduceMotion === true;

  useEffect(() => {
    if (shown) return;
    const onScroll = () => {
      if (window.scrollY > THRESHOLD_PX) setScrolled(true);
    };
    // Run once first: a refresh partway down the page, or an anchor link,
    // lands already scrolled, and the nav should simply be there rather
    // than waiting for a gesture the visitor has no reason to make.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [shown]);

  return (
    <div
      inert={!shown}
      aria-hidden={!shown}
      // Two constraints fight here.
      //
      // Never transform: a transformed ancestor becomes the containing
      // block for the fixed header inside and drops it out of the viewport.
      //
      // And once shown, emit no `opacity` at all rather than `opacity: 1`.
      // An ancestor with opacity below 1 establishes a backdrop root, and a
      // descendant's `backdrop-filter` then samples that empty root instead
      // of the page — the nav's glass would quietly stop blurring anything.
      // Dropping the property leaves the element at its default 1 with no
      // stacking context, so the blur keeps seeing the real backdrop. The
      // transition still animates, from 0 to that default.
      style={{
        opacity: shown ? undefined : 0,
        transition: "opacity 1100ms var(--ease-cut)",
      }}
    >
      {children}
    </div>
  );
}
