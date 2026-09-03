"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Options = {
  lines: string[];
  /**
   * When false the sequence stops on the last line and rests there — a
   * scene that ends. When true it cycles, which suits a small ambient
   * detail but reads as restless anywhere it holds the eye.
   */
  loop: boolean;
  typeMs: number;
  holdMs: number;
  deleteMs: number;
  gapMs: number;
};

type State = {
  /** The visible slice of the current line. */
  text: string;
  /** Which line is showing, for callers that pair it with a label. */
  lineIndex: number;
  /** The line has finished typing — used to blink the caret only at rest. */
  complete: boolean;
  /** Reduced motion is on; render the lines statically instead. */
  isStatic: boolean;
};

/** Composing pauses. A comma is a breath, a full stop is a thought. */
const PAUSE_COMMA_MS = 240;
const PAUSE_PERIOD_MS = 500;

/**
 * Types a list of lines out one at a time, erasing between them.
 *
 * Extracted once a second surface needed it — the cold open and the hero's
 * role line. The two want different rhythms and different endings, so the
 * timings and `loop` are the caller's to choose; what is shared is the
 * state machine and the punctuation pauses that keep it reading as someone
 * composing rather than a machine printing.
 *
 * Callers are responsible for the accessibility half: the animated element
 * should be `aria-hidden`, with the full list of lines present in the DOM
 * for crawlers and assistive tech. Text that replaces itself every few
 * seconds is hostile to a screen reader, and only one line of it is ever
 * visible to a crawler.
 */
export function useTypewriter({
  lines,
  loop,
  typeMs,
  holdMs,
  deleteMs,
  gapMs,
}: Options): State {
  const reduceMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [erasing, setErasing] = useState(false);

  const text = lines[lineIndex] ?? "";
  const isLast = lineIndex === lines.length - 1;
  const complete = charCount === text.length;

  useEffect(() => {
    if (reduceMotion) return;

    if (!erasing) {
      if (charCount < text.length) {
        const justTyped = text[charCount - 1];
        const pause =
          justTyped === "." ? PAUSE_PERIOD_MS : justTyped === "," ? PAUSE_COMMA_MS : 0;
        const id = setTimeout(() => setCharCount((c) => c + 1), typeMs + pause);
        return () => clearTimeout(id);
      }
      // Resolved: nothing further to schedule, the line simply stays.
      if (isLast && !loop) return;
      const id = setTimeout(() => setErasing(true), holdMs);
      return () => clearTimeout(id);
    }

    if (charCount > 0) {
      const id = setTimeout(() => setCharCount((c) => c - 1), deleteMs);
      return () => clearTimeout(id);
    }
    // Empty screen: the index advances here, with no text to contradict it.
    const id = setTimeout(() => {
      setLineIndex((i) => (i + 1) % lines.length);
      setErasing(false);
    }, gapMs);
    return () => clearTimeout(id);
  }, [
    charCount,
    erasing,
    text,
    isLast,
    loop,
    lines.length,
    typeMs,
    holdMs,
    deleteMs,
    gapMs,
    reduceMotion,
  ]);

  return {
    text: text.slice(0, charCount),
    lineIndex,
    complete,
    isStatic: reduceMotion === true,
  };
}
