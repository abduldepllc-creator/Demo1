import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "./reveal";

export type Feature = { icon: LucideIcon; title: string; text: string };

/** Grid of icon cards with a hover lift, colour flip and cursor spotlight. */
export function FeatureGrid({
  items,
  className,
  dark = false,
}: {
  items: Feature[];
  className?: string;
  dark?: boolean;
}) {
  return (
    <Stagger className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((f) => (
        <StaggerItem key={f.title}>
          <div
            className={cn(
              "spotlight group h-full overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1.5",
              dark
                ? "spotlight-light border border-white/10 bg-white/5 hover:bg-white/10"
                : "border border-navy/8 bg-white hover:shadow-lift",
            )}
          >
            <span
              className={cn(
                "grid size-14 place-items-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                dark ? "bg-brand text-white" : "bg-brand-50 text-brand group-hover:bg-brand group-hover:text-white",
              )}
            >
              <f.icon className="size-7" />
            </span>
            <h3 className={cn("mt-6 text-lg font-extrabold", dark ? "text-white" : "text-navy")}>{f.title}</h3>
            <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-white/70" : "text-muted")}>{f.text}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
