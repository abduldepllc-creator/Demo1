import { cn } from "@/lib/utils";

// Deterministic positions so server and client markup match.
const BUBBLES = [
  { left: 4, size: 14, delay: 0, duration: 13 },
  { left: 11, size: 26, delay: 3, duration: 17 },
  { left: 19, size: 10, delay: 6, duration: 12 },
  { left: 27, size: 18, delay: 1.5, duration: 15 },
  { left: 36, size: 8, delay: 8, duration: 11 },
  { left: 44, size: 22, delay: 4.5, duration: 18 },
  { left: 53, size: 12, delay: 2, duration: 14 },
  { left: 61, size: 30, delay: 7, duration: 20 },
  { left: 69, size: 10, delay: 0.5, duration: 12 },
  { left: 77, size: 20, delay: 5, duration: 16 },
  { left: 85, size: 14, delay: 9, duration: 13 },
  { left: 93, size: 24, delay: 3.5, duration: 19 },
];

export function Bubbles({ className, count = BUBBLES.length }: { className?: string; count?: number }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {BUBBLES.slice(0, count).map((b, i) => (
        <span
          key={i}
          className="animate-rise absolute -bottom-10 rounded-full border border-white/40 bg-linear-to-br from-white/35 to-white/5 shadow-[inset_-2px_-3px_6px_rgba(255,255,255,0.25)]"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
