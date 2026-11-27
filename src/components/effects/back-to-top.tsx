"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const R = 22;
const C = 2 * Math.PI * R;

/** Back-to-top button with a scroll progress ring. Updates via rAF, no re-render per frame. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = String(C * (1 - progress));
      setVisible(window.scrollY > 600);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-22 right-4.5 z-40 grid size-12 place-items-center rounded-full bg-white text-navy shadow-lift transition-all duration-500 hover:-translate-y-1 sm:right-6.5 sm:bottom-24",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={R} fill="none" stroke="rgb(13 44 80 / 0.08)" strokeWidth="2.5" />
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="#299d36"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <ArrowUp className="relative size-5" />
    </button>
  );
}
