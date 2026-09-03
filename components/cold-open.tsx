"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const TYPE_MS = 38;
const DELETE_MS = 18;
/** Long enough to finish reading a two-line fact before it starts erasing. */
const HOLD_MS = 2400;
const GAP_MS = 450;

/**
 * The scene before the title card.
 *
 * A portfolio that opens with its owner's name opens with the one piece of
 * information the visitor has no reason to care about yet. This runs the
 * evidence first and introduces the person second — a cold open — which is
 * the grammar the site was already built on: the scroll cue reads
 * "press play".
 *
 * The typewriter is the one effect this site can justify. It is a worn
 * device almost everywhere else, but here the subject *is* screenwriting
 * and editing, set in monospace: the mechanism and the meaning are the
 * same thing.
 *
 * Two costs it would otherwise carry, both paid below:
 *
 *   - Only one line existing at a time would leave four of five expertise
 *     claims invisible to crawlers.
 *   - Text replacing itself every few seconds is hostile to screen
 *     readers.
 *
 * So the animation is presentation only — `aria-hidden`, driven by state —
 * while all five facts sit in the DOM as a real list, exposed to crawlers
 * and assistive tech. Same content, two deliveries. With reduced motion
 * that list simply becomes the visible one.
 */
export function ColdOpen({ dict }: { dict: Dictionary }) {
  const reduceMotion = useReducedMotion();
  const frames = dict.coldOpen.frames;

  const [frameIndex, setFrameIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "deleting">("typing");

  useEffect(() => {
    if (reduceMotion) return;
    const { line } = frames[frameIndex];

    if (phase === "typing") {
      if (charCount < line.length) {
        const id = setTimeout(() => setCharCount((c) => c + 1), TYPE_MS);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase("deleting"), HOLD_MS);
      return () => clearTimeout(id);
    }

    if (charCount > 0) {
      const id = setTimeout(() => setCharCount((c) => c - 1), DELETE_MS);
      return () => clearTimeout(id);
    }
    // Empty: the axis label swaps here, while there is no text to contradict.
    const id = setTimeout(() => {
      setFrameIndex((i) => (i + 1) % frames.length);
      setPhase("typing");
    }, GAP_MS);
    return () => clearTimeout(id);
  }, [charCount, phase, frameIndex, frames, reduceMotion]);

  const current = frames[frameIndex];

  return (
    /* Full viewport on purpose. A cold open that shares the screen with
       what follows isn't a scene, it's a block — the reader has to arrive
       at the bottom of it and *choose* to scroll for the first scroll to
       feel like starting the projection. `svh` rather than `vh` so mobile
       browser chrome doesn't crop it. `pt-16` clears the fixed nav. */
    <section
      data-scene={dict.coldOpen.slugline}
      aria-label={dict.coldOpen.slugline}
      className="relative flex min-h-[100svh] flex-col justify-center px-4 pt-16 sm:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
          {dict.coldOpen.slugline}
        </p>

        {reduceMotion ? (
          /* No animation: the same five facts, shown at once. */
          <ul className="mt-12 flex flex-col">
            {frames.map((frame) => (
              <li key={frame.axis} className="border-t border-border py-7 sm:py-9">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  {frame.axis}
                </p>
                <p className="mt-3 max-w-4xl font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                  {frame.line}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <>
            {/* Presentation layer. The height is reserved so a short line
                followed by a long one doesn't shove the page down mid-type —
                the layout shift would be measured against the site. */}
            <div aria-hidden="true" className="mt-12">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {current.axis}
              </p>
              <p className="mt-3 min-h-[7.5rem] max-w-4xl font-display text-2xl font-semibold leading-snug tracking-tight sm:min-h-[9rem] sm:text-4xl">
                {current.line.slice(0, charCount)}
                <span
                  className={`ml-0.5 inline-block h-[0.85em] w-[0.5ch] translate-y-[0.08em] bg-signal align-baseline ${
                    charCount === current.line.length ? "caret-blink" : ""
                  }`}
                />
              </p>
            </div>

            {/* The real content: read by crawlers and screen readers, never
                shown, because the sighted reader gets it above in sequence. */}
            <ul className="sr-only">
              {frames.map((frame) => (
                <li key={frame.axis}>
                  {frame.axis}: {frame.line}
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-10 border-t border-signal pt-7 font-mono text-sm uppercase tracking-wider text-signal">
          {dict.coldOpen.bridge}
        </p>
      </div>

      {/* The affordance that makes the full-height choice work: without it
          a screen that ends cleanly reads as the whole page. Mirrors the
          hero's cue, one beat earlier in the sequence. */}
      <div className="absolute bottom-8 left-4 hidden font-mono text-[11px] uppercase tracking-widest text-muted sm:left-8 sm:flex sm:items-center sm:gap-2">
        <span className="h-px w-8 bg-border" />
        {dict.coldOpen.cue}
      </div>
    </section>
  );
}
