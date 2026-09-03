"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * The scene before the title card.
 *
 * A portfolio that opens with its owner's name opens with the one piece of
 * information the visitor has no reason to care about yet. This runs the
 * evidence first and introduces the person second, which is what a cold
 * open does in film — and the site was already built on that grammar: the
 * scroll cue literally reads "press play".
 *
 * Every line is a fact from a real project. The axis labels beside them
 * carry the claim the copy never states: five disciplines, no sentence
 * declaring expertise in any of them.
 */
export function ColdOpen({ dict }: { dict: Dictionary }) {
  return (
    <section
      data-scene={dict.coldOpen.slugline}
      aria-label={dict.coldOpen.slugline}
      className="px-4 pb-24 pt-32 sm:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
          {dict.coldOpen.slugline}
        </p>

        <div className="mt-12 flex flex-col">
          {dict.coldOpen.frames.map((frame, index) => (
            <motion.div
              key={frame.axis}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: [0.65, 0, 0.35, 1],
              }}
              className="border-t border-border py-7 sm:py-9"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {frame.axis}
              </p>
              <p className="mt-3 max-w-4xl font-display text-2xl font-semibold leading-snug tracking-tight text-fg sm:text-3xl">
                {frame.line}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          className="mt-10 border-t border-signal pt-7 font-mono text-sm uppercase tracking-wider text-signal"
        >
          {dict.coldOpen.bridge}
        </motion.p>
      </div>
    </section>
  );
}
