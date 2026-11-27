import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div className="animate-marquee flex w-max shrink-0 items-center hover:[animation-play-state:paused]">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-6 text-lg font-extrabold whitespace-nowrap sm:text-2xl">
            {item}
            <Sparkle className="size-5 fill-current opacity-70" />
          </span>
        ))}
      </div>
    </div>
  );
}
