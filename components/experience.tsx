"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SceneHeading } from "./scene-heading";

export function Experience({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="experiencia"
      data-scene={dict.experience.slugline}
      aria-labelledby="experience-heading"
      className="border-t border-border px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SceneHeading
          slugline={dict.experience.slugline}
          title={dict.experience.title}
        />

        <div className="filmstrip-rule mb-2 max-w-full" />
        <ol className="relative border-l border-border pl-6 sm:pl-10">
          {dict.experience.items.map((item, index) => (
            <motion.li
              key={`${item.company}-${item.period}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
              className="relative pb-12 last:pb-0"
            >
              <span className="absolute -left-[calc(1.5rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-signal sm:-left-[calc(2.5rem+5px)]" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-xl font-semibold sm:text-2xl">
                  {item.company}
                </h3>
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  {item.period}
                </span>
              </div>
              <p className="mt-1 font-mono text-xs uppercase tracking-wider text-signal">
                {item.role}
              </p>
              <ul className="mt-3 space-y-2">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="max-w-2xl text-muted">
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
        <div className="filmstrip-rule mt-2 max-w-full" />
      </div>
    </section>
  );
}
