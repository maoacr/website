"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const line = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const },
  },
};

export function Hero({ dict }: { dict: Dictionary }) {
  const reduceMotion = useReducedMotion();
  const nameLines = dict.hero.name.split("\n");

  return (
    <section
      data-scene={dict.hero.slugline}
      aria-label={dict.hero.name.replace("\n", " ")}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-4 pt-16 sm:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          <span>{dict.hero.rec}</span>
          <span className="opacity-40">·</span>
          <span>{dict.hero.slugline}</span>
        </div>

        <motion.h1
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "show"}
          variants={container}
          className="font-display text-[13vw] font-semibold leading-[0.95] tracking-tight sm:text-[7.5vw] lg:text-8xl"
        >
          {nameLines.map((text) => (
            <span key={text} className="block overflow-hidden">
              <motion.span variants={reduceMotion ? undefined : line} className="block">
                {text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.65, 0, 0.35, 1] }}
          className="mt-6 max-w-xl font-mono text-xs uppercase tracking-[0.2em] text-signal"
        >
          {dict.hero.kicker}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.65, 0, 0.35, 1] }}
          className="mt-4 max-w-xl text-lg text-muted sm:text-xl"
        >
          {dict.hero.lead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: [0.65, 0, 0.35, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#proyectos"
            className="rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase tracking-wider text-bg transition-colors hover:bg-signal hover:text-white"
          >
            {dict.hero.cta1}
          </a>
          <a
            href="#contacto"
            className="rounded-full border border-border px-6 py-3 font-mono text-xs uppercase tracking-wider text-fg transition-colors hover:border-signal hover:text-signal"
          >
            {dict.hero.cta2}
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="absolute bottom-8 left-4 hidden font-mono text-[11px] uppercase tracking-widest text-muted sm:left-8 sm:flex sm:items-center sm:gap-2"
      >
        <span className="h-px w-8 bg-border" />
        {dict.hero.scrollCue}
      </motion.div>
    </section>
  );
}
