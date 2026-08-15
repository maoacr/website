"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SceneHeading({
  slugline,
  title,
  eyebrowOnly = false,
  children,
}: {
  slugline: string;
  title: string;
  eyebrowOnly?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 sm:mb-14">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal"
      >
        {slugline}
      </motion.p>
      {!eyebrowOnly && (
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.05 }}
          className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          {title}
        </motion.h2>
      )}
      {children}
    </div>
  );
}
