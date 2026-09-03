"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Pacing.
 *
 * The point of this screen is a quiet room where someone is writing, and
 * that is built from contrast rather than speed: compose slowly, sit
 * still, erase in one decisive gesture, then say nothing for a beat.
 * Uniform motion — even slow uniform motion — reads as a machine
 * printing. Stillness is what makes it feel like thinking.
 *
 * These lines are cross-domain observations, not headlines — sRGB
 * midtones, 10ms of audio latency. HOLD has to cover reading one *and*
 * turning it over, which is roughly twice what reading alone needs.
 *
 * TYPE and HOLD are balanced so stillness at least matches motion. An
 * earlier pass had typing take longer than the pause that followed it,
 * which inverts the intent: waiting for a sentence to finish appearing is
 * not the same as being given time to think about it.
 */
const TYPE_MS = 45;
/** Composing pauses at punctuation. A comma is a breath, a full stop is a thought. */
const PAUSE_COMMA_MS = 240;
const PAUSE_PERIOD_MS = 500;
const HOLD_MS = 5500;
/** Fast on purpose: one wipe of the hand, not sixty nervous backspaces. */
const DELETE_MS = 13;
/** Silence. An empty screen between thoughts is the calmest frame here. */
const GAP_MS = 1100;

/**
 * The scene before the title card.
 *
 * A portfolio that opens with its owner's name opens with the one piece of
 * information the visitor has no reason to care about yet. This runs the
 * evidence first and introduces the person second — a cold open — which is
 * the grammar the site was already built on: the scroll cue reads
 * "press play".
 *
 * The sequence ENDS rather than looping. A scene that repeats forever is
 * restless, and restless is the opposite of the intent; it also means the
 * visitor who waits is paid off with the closing line instead of watching
 * a treadmill.
 *
 * The typewriter is the one effect this site can justify — the subject
 * *is* screenwriting and editing, set in monospace, so mechanism and
 * meaning are the same thing. Its two usual costs are paid, not accepted:
 * one line in the DOM at a time would hide four of five observations from
 * crawlers, and text replacing itself is hostile to screen readers. So the
 * animation is presentation only (`aria-hidden`) and every line lives in
 * the DOM as a real list. With reduced motion that list simply becomes the
 * visible rendering.
 */
export function ColdOpen({ dict }: { dict: Dictionary }) {
  const reduceMotion = useReducedMotion();
  const { frames, bridge, slugline, cue } = dict.coldOpen;

  // The last step is the closing line, which has no axis label and never
  // erases — the scene resolves there and rests.
  const lastStep = frames.length;
  const [step, setStep] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [erasing, setErasing] = useState(false);

  const isClosing = step === lastStep;
  const text = isClosing ? bridge : frames[step].line;
  const complete = charCount === text.length;

  useEffect(() => {
    if (reduceMotion) return;

    if (!erasing) {
      if (charCount < text.length) {
        const justTyped = text[charCount - 1];
        const pause =
          justTyped === "." ? PAUSE_PERIOD_MS : justTyped === "," ? PAUSE_COMMA_MS : 0;
        const id = setTimeout(() => setCharCount((c) => c + 1), TYPE_MS + pause);
        return () => clearTimeout(id);
      }
      if (isClosing) return; // Resolved. Nothing further to schedule.
      const id = setTimeout(() => setErasing(true), HOLD_MS);
      return () => clearTimeout(id);
    }

    if (charCount > 0) {
      const id = setTimeout(() => setCharCount((c) => c - 1), DELETE_MS);
      return () => clearTimeout(id);
    }
    // Empty screen: the axis label swaps here, with no text to contradict it.
    const id = setTimeout(() => {
      setStep((s) => s + 1);
      setErasing(false);
    }, GAP_MS);
    return () => clearTimeout(id);
  }, [charCount, erasing, text, isClosing, reduceMotion]);

  return (
    <section
      data-scene={slugline}
      aria-label={slugline}
      className="relative flex min-h-[100svh] flex-col justify-center px-4 pt-16 sm:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
          {slugline}
        </p>

        {reduceMotion ? (
          <>
            <ul className="mt-12 flex flex-col">
              {frames.map((frame) => (
                <li key={frame.axis} className="border-t border-border py-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {frame.axis}
                  </p>
                  <p className="mt-2 max-w-5xl font-display text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                    {frame.line}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-sm uppercase tracking-wider text-signal">
              {bridge}
            </p>
          </>
        ) : (
          <>
            {/* Presentation layer. Height is reserved for the longest line
                so a short fact followed by a long one cannot shove the page
                mid-type — that layout shift gets measured against the site. */}
            <div aria-hidden="true" className="mt-14">
              <p className="h-4 font-mono text-[10px] uppercase tracking-wider text-muted">
                {isClosing ? "" : frames[step].axis}
              </p>
              <p
                className={`mt-4 min-h-[11rem] max-w-5xl font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:min-h-[15rem] sm:text-5xl lg:text-6xl ${
                  isClosing ? "text-signal" : "text-fg"
                }`}
              >
                {text.slice(0, charCount)}
                <span
                  className={`ml-1 inline-block h-[0.8em] w-[0.45ch] translate-y-[0.06em] bg-signal align-baseline ${
                    complete ? "caret-blink" : ""
                  }`}
                />
              </p>
            </div>

            {/* The real content: read by crawlers and assistive tech, never
                shown, because the sighted reader gets it above in sequence. */}
            <ul className="sr-only">
              {frames.map((frame) => (
                <li key={frame.axis}>
                  {frame.axis}: {frame.line}
                </li>
              ))}
              <li>{bridge}</li>
            </ul>
          </>
        )}
      </div>

      {/* The affordance that makes the full-height choice work: a screen
          that ends cleanly otherwise reads as the whole page. */}
      <div className="absolute bottom-8 left-4 hidden font-mono text-[11px] uppercase tracking-widest text-muted sm:left-8 sm:flex sm:items-center sm:gap-2">
        <span className="h-px w-8 bg-border" />
        {cue}
      </div>
    </section>
  );
}
