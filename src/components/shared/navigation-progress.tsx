"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Slim top progress bar shown while navigating between pages (site & admin).
 * Starts on internal link clicks, finishes when the new route renders.
 * One delegated click listener; the animation itself is CSS.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [route, setRoute] = useState(`${pathname}?${searchParams}`);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Route changed → finish the bar (adjusting state during render, no effect needed).
  const current = `${pathname}?${searchParams}`;
  if (current !== route) {
    setRoute(current);
    if (state === "loading") setState("done");
  }

  useEffect(() => {
    if (state !== "done") return;
    const t = setTimeout(() => setState("idle"), 350);
    return () => clearTimeout(t);
  }, [state]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / hash link
      setState("loading");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), 15000); // safety net
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (state === "idle") return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-80 h-0.75" aria-hidden="true">
      <div
        className={cn(
          "h-full bg-linear-to-r from-brand via-brand-400 to-[#9be15d] shadow-[0_0_10px_rgba(76,194,90,0.8)]",
          state === "loading" ? "nav-progress" : "origin-left scale-x-100 opacity-0 transition-[transform,opacity] duration-300",
        )}
      />
    </div>
  );
}
