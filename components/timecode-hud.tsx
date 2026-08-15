"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

const FPS = 24;
const REEL_SECONDS = 210; // total "runtime" of the page, purely a stylistic mapping

function formatTimecode(progress: number) {
  const totalFrames = Math.floor(progress * REEL_SECONDS * FPS);
  const frames = totalFrames % FPS;
  const totalSeconds = Math.floor(totalFrames / FPS);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

export function TimecodeHud({ sceneLabel }: { sceneLabel: string }) {
  const { scrollYProgress } = useScroll();
  // Lazy initializer reads the current scroll position once, on first
  // render, instead of rendering a "00:00:00:00" frame and then
  // correcting it from an effect.
  const [timecode, setTimecode] = useState(() =>
    formatTimecode(scrollYProgress.get())
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setTimecode(formatTimecode(progress));
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-4 left-4 z-40 hidden select-none items-center gap-2 font-mono text-[11px] tracking-wider text-muted sm:flex"
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
      <span className="tabular-nums">{timecode}</span>
      <span className="mx-1 opacity-40">/</span>
      <span className="uppercase">{sceneLabel}</span>
    </div>
  );
}
