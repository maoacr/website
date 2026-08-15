"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SceneHeading } from "./scene-heading";

export function Skills({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="skills"
      data-scene={dict.skills.slugline}
      aria-labelledby="skills-heading"
      className="border-t border-border px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SceneHeading slugline={dict.skills.slugline} title={dict.skills.title} />

        <div className="grid gap-10 sm:grid-cols-2">
          {dict.skills.groups.map((group, groupIndex) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: (groupIndex % 4) * 0.06 }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
                {group.label}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-fg"
                  >
                    {item.name}
                    <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
                      {item.level}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
            {dict.skills.languagesTitle}
          </p>
          <ul className="mt-4 flex flex-wrap gap-6">
            {dict.skills.languages.map((lang) => (
              <li key={lang.name} className="text-sm text-muted">
                <span className="font-medium text-fg">{lang.name}</span> —{" "}
                {lang.level}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
