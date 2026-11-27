import Image from "next/image";
import { cn } from "@/lib/utils";

const BUBBLES = [
  { left: "18%", size: 7, delay: "0s" },
  { left: "72%", size: 9, delay: "0.8s" },
  { left: "45%", size: 6, delay: "1.5s" },
];

/**
 * Lightweight branded loader: logo inside a spinning gradient ring, a breathing
 * halo and rising soap bubbles. Pure CSS (transform/opacity only), no JavaScript.
 */
export function BrandLoader({
  label = "Loading",
  tone = "light",
  size = "md",
  className,
}: {
  label?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dark = tone === "dark";
  const box = { sm: "size-14", md: "size-20", lg: "size-28" }[size];
  const logo = { sm: "h-7", md: "h-10", lg: "h-14" }[size];

  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col items-center gap-4", className)}>
      <div className={cn("relative grid place-items-center", box)}>
        {/* Breathing halo */}
        <span className={cn("animate-loader-halo absolute inset-0 rounded-full", dark ? "bg-brand/40" : "bg-brand/25")} />
        {/* Gradient ring */}
        <span
          className="animate-loader-ring absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, #4cc25a 200deg, #299d36 320deg, transparent 360deg)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
          }}
        />
        {/* Track */}
        <span className={cn("absolute inset-0 rounded-full border-[3px]", dark ? "border-white/10" : "border-navy/8")} />
        {/* Logo */}
        <span className={cn("relative grid place-items-center rounded-full", dark ? "bg-white/5" : "bg-white shadow-soft", "size-[78%]")}>
          <Image src="/images/logo-mark.png" alt="" width={478} height={555} sizes="56px" className={cn("w-auto", logo)} priority />
        </span>
        {/* Bubbles */}
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className={cn("animate-loader-bubble absolute bottom-1 rounded-full border", dark ? "border-white/60 bg-white/20" : "border-brand/40 bg-brand/10")}
            style={{ left: b.left, width: b.size, height: b.size, animationDelay: b.delay }}
          />
        ))}
      </div>
      {label && (
        <p className={cn("flex items-center text-sm font-bold tracking-wide", dark ? "text-white/80" : "text-navy")}>
          {label}
          <span className="ml-0.5 inline-flex" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="animate-loader-dot" style={{ animationDelay: `${i * 0.15}s` }}>
                .
              </span>
            ))}
          </span>
        </p>
      )}
    </div>
  );
}
