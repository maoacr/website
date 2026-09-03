"use client";

import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/** Only act while the visitor is genuinely still at the top of the page. */
const TOP_TOLERANCE_PX = 40;
/** Ignore a thumb resting on the glass; require a real swipe. */
const TOUCH_INTENT_PX = 24;

/**
 * Spends exactly one scroll gesture to cross the cold open.
 *
 * The cold open is a full viewport, so reaching the introduction takes
 * several flicks of a trackpad — enough friction that people give up
 * before the site has said who it belongs to. One gesture, one cut, which
 * is also the metaphor the page runs on.
 *
 * Scroll hijacking is a genuinely hostile pattern and this is deliberately
 * the narrowest possible version of it:
 *
 *   - It fires once per page load and unbinds itself immediately.
 *   - It only triggers from the very top, so it can never catch someone
 *     mid-page or on the way back up.
 *   - Keyboard scrolling is untouched. Page Down, Space and the arrows
 *     behave normally, which also means it can never trap assistive tech.
 *   - Reduced motion skips it entirely: a scripted jump is exactly what
 *     that preference is asking not to happen.
 *
 * Browsers cancel a smooth programmatic scroll when the user scrolls
 * during it, so the gesture stays abortable — which is the line between
 * an assist and a fight.
 */
export function FirstScrollAssist({ targetId }: { targetId: string }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    let spent = false;
    let touchStartY = 0;

    function cleanup() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    }

    function go() {
      spent = true;
      cleanup();
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function onWheel(event: WheelEvent) {
      if (spent || event.deltaY <= 0 || window.scrollY > TOP_TOLERANCE_PX) return;
      event.preventDefault();
      go();
    }

    function onTouchStart(event: TouchEvent) {
      touchStartY = event.touches[0]?.clientY ?? 0;
    }

    function onTouchMove(event: TouchEvent) {
      if (spent || window.scrollY > TOP_TOLERANCE_PX) return;
      const travelled = touchStartY - (event.touches[0]?.clientY ?? touchStartY);
      if (travelled < TOUCH_INTENT_PX) return;
      event.preventDefault();
      go();
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return cleanup;
  }, [targetId, reduceMotion]);

  return null;
}
