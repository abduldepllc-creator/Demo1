import { cn } from "@/lib/utils";

/**
 * Animated soft colour blobs for section backgrounds.
 * Pure CSS (transform-only keyframes), no JavaScript.
 */
export function Aurora({ variant = "dark", className }: { variant?: "dark" | "light"; className?: string }) {
  const dark = variant === "dark";
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden="true">
      <span
        className={cn(
          "aurora animate-drift -top-[20%] -right-[10%] size-128 sm:size-160",
          dark ? "bg-brand/35" : "bg-brand/15",
        )}
      />
      <span
        className={cn(
          "aurora animate-drift-alt -bottom-[25%] -left-[10%] size-112 sm:size-144",
          dark ? "bg-[#2f6fd1]/30" : "bg-navy/10",
        )}
      />
      <span
        className={cn(
          "aurora animate-drift top-[30%] left-[40%] size-72 [animation-delay:-8s] sm:size-88",
          dark ? "bg-[#9be15d]/12" : "bg-brand-400/10",
        )}
      />
    </div>
  );
}
