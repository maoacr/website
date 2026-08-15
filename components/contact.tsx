"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SceneHeading } from "./scene-heading";

const EMAIL = "iam@maoacr.com";
const WHATSAPP = "https://wa.me/573192994168";
const LINKEDIN = "https://linkedin.com/in/maoacr";

export function Contact({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="contacto"
      data-scene={dict.contact.slugline}
      aria-labelledby="contact-heading"
      className="border-t border-border px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SceneHeading slugline={dict.contact.slugline} title={dict.contact.title} />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-lg text-muted"
        >
          {dict.contact.lead}
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-full bg-fg px-6 py-3 font-mono text-xs uppercase tracking-wider text-bg transition-colors hover:bg-signal hover:text-white"
          >
            {dict.contact.email}
          </a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-border px-6 py-3 font-mono text-xs uppercase tracking-wider text-fg transition-colors hover:border-signal hover:text-signal"
          >
            {dict.contact.whatsapp}
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-border px-6 py-3 font-mono text-xs uppercase tracking-wider text-fg transition-colors hover:border-signal hover:text-signal"
          >
            LinkedIn
          </a>
        </div>

        <p className="mt-12 font-mono text-xs uppercase tracking-wider text-muted">
          {dict.contact.location}
        </p>
      </div>
    </section>
  );
}
