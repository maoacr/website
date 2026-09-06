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
                  <li key={edu.school} className="flex items-start gap-4">
                    {/* Text mark rather than an image. A third-party logo
                        cannot be recoloured to sit on both themes without
                        breaking that owner's brand guidelines, and the two
                        marks here have no monochrome version to use. This
                        reads as the institution and costs no request. */}
                    <span className="inline-flex h-10 shrink-0 items-center rounded-xl border border-border px-3 font-mono text-[11px] uppercase tracking-wider text-muted">
                      {edu.mark}
                    </span>
                    <div>
                      <p className="font-medium text-fg">{edu.school}</p>
                      <p className="text-sm text-muted">{edu.program}</p>
                      <p className="font-mono text-xs text-muted/80">{edu.period}</p>
                    </div>
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
            {dict.about.stats.map((stat) => {
              // Only some stats have somewhere to go, so the array holds a
              // union and the property has to be narrowed rather than read.
              const href = "href" in stat ? stat.href : undefined;

              return (
                <div
                  key={stat.label}
                  className={`relative bg-bg p-6 ${
                    href ? "group transition-colors hover:bg-surface" : ""
                  }`}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-mono text-3xl font-semibold tabular-nums text-fg sm:text-4xl">
                    {stat.value}
                  </dd>
                  <p className="mt-2 flex items-start gap-1.5 text-xs uppercase tracking-wide text-muted">
                    <span>{stat.label}</span>
                    {href && (
                      <span
                        aria-hidden="true"
                        className="transition-colors group-hover:text-signal"
                      >
                        ↗
                      </span>
                    )}
                  </p>

                  {/* Stretched link rather than wrapping the cell: an <a>
                      is not valid as a direct child of <dl>, and the whole
                      quadrant should still be the target. */}
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="absolute inset-0 rounded-none"
                    >
                      <span className="sr-only">{stat.label}</span>
                    </a>
                  )}
                </div>
              );
            })}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
