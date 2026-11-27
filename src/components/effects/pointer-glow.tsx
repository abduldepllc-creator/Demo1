"use client";

import { useEffect } from "react";

/**
 * One delegated, rAF-throttled pointer listener for the whole site.
 * Sets --mx / --my on whichever `.spotlight` element is under the cursor,
 * so cards get a cursor-following glow without per-card JavaScript.
 * Skipped on touch devices.
 */
export function PointerGlow() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      if (!last) return;
      const el = (last.target as Element | null)?.closest?.(".spotlight") as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      el.style.setProperty("--my", `${last.clientY - rect.top}px`);
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
