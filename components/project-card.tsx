"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data/projects";
import type { Locale } from "@/lib/i18n/config";

export function ProjectCard({
  project,
  locale,
  index,
  ctaLabel,
  size = "sm",
}: {
  project: Project;
  locale: Locale;
  index: number;
  ctaLabel: string;
  /** "lg" = headline case study (2-col grid), "sm" = secondary work (3-col grid). */
  size?: "lg" | "sm";
}) {
  const copy = project[locale];

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.08 }}
      className="group overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div
        className={`relative overflow-hidden ${size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]"}`}
      >
        <Image
          src={project.image}
          alt={copy.title}
          fill
          sizes={
            size === "lg"
              ? "(min-width: 640px) 50vw, 100vw"
              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-bg/85 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted backdrop-blur-sm">
          {project.year}
        </div>
      </div>

      <div className={size === "lg" ? "p-7" : "p-6"}>
        <p className="font-mono text-[11px] uppercase tracking-wider text-signal">
          {copy.role}
        </p>
        <h3
          className={`mt-1.5 font-display font-semibold leading-snug ${size === "lg" ? "text-2xl" : "text-xl"}`}
        >
          {copy.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{copy.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-fg transition-colors group-hover:text-signal"
          >
            {ctaLabel}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>

          {project.links?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-signal"
            >
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
