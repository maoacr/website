"use client";

import { useEffect, useState } from "react";
import { TimecodeHud } from "./timecode-hud";

function firstSceneLabel(): string {
  if (typeof document === "undefined") return "";
  return document.querySelector("[data-scene]")?.getAttribute("data-scene") ?? "";
}

export function ScrollScenes() {
  // Lazy initializer covers the "what's the first scene" read; the
  // effect below only subscribes to the IntersectionObserver from then on.
  const [active, setActive] = useState(firstSceneLabel);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene]")
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.getAttribute("data-scene") ?? "");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return <TimecodeHud sceneLabel={active} />;
}
