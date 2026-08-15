"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SceneHeading } from "./scene-heading";

export function About({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="sobre-mi"
      data-scene={dict.about.slugline}
      aria-labelledby="about-heading"
      className="border-t border-border px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SceneHeading slugline={dict.about.slugline} title={dict.about.title} />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            {dict.about.paragraphs.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="mb-5 text-lg leading-relaxed text-muted last:mb-0"
              >
                {paragraph}
              </motion.p>
            ))}

            <div className="mt-12">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
                {dict.about.educationTitle}
              </p>
              <ul className="mt-4 space-y-4">
                {dict.about.education.map((edu) => (
                  <li key={edu.school} className="border-l border-border pl-4">
                    <p className="font-medium text-fg">{edu.school}</p>
                    <p className="text-sm text-muted">{edu.program}</p>
                    <p className="font-mono text-xs text-muted/80">{edu.period}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border"
          >
            {dict.about.stats.map((stat) => (
              <div key={stat.label} className="bg-bg p-6">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-mono text-3xl font-semibold tabular-nums text-fg sm:text-4xl">
                  {stat.value}
                </dd>
                <p className="mt-2 text-xs uppercase tracking-wide text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
