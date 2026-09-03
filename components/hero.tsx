"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useTypewriter } from "@/lib/hooks/use-typewriter";

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

  // Quicker than the cold open's rhythm on purpose. That screen is the
  // main event and is paced for thinking; this is an ambient detail beside
  // a name, and the same slowness here would pull the eye off the name.
  // It loops, which suits a small accompaniment but would read as restless
  // on anything that holds attention.
  const role = useTypewriter({
    lines: dict.hero.roles,
    loop: true,
    typeMs: 55,
    holdMs: 2200,
    deleteMs: 26,
    gapMs: 380,
  });

  return (
    <section
      // The one section that had no id. The cold open's invitation and its
      // first-scroll assist both land here, and every other section already
      // names itself this way.
      id="intro"
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

        {/* This line used to sit in the nav, between Blog and the locale
            switch, where it read as a menu item it never was. It is an
            identity statement, so it belongs beside the name.
            The rotating half echoes the cold open's typewriter, kept to
            this line's own size so it accompanies the name rather than
            competing with it. */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.65, 0, 0.35, 1] }}
          className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-signal"
        >
          <span>{dict.hero.rolePrefix} </span>
          {/* Presentation only. The full list sits below for crawlers and
              assistive tech — these are exactly the terms worth indexing,
              and one at a time is one indexed. */}
          <span aria-hidden="true">
            {role.text}
            <span
              className={`ml-0.5 inline-block h-[0.85em] w-[0.5ch] translate-y-[0.1em] bg-signal align-baseline ${
                role.complete ? "caret-blink" : ""
              }`}
            />
          </span>
          <span className="sr-only">{dict.hero.roles.join(", ")}</span>
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
