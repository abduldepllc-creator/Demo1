import type { LucideIcon } from "lucide-react";
import { Stagger, StaggerItem } from "./reveal";

export type Step = { icon: LucideIcon; title: string; text: string };

/** Numbered process steps joined by a dashed line on desktop. */
export function Steps({ items }: { items: Step[] }) {
  return (
    <div className="relative">
      <div className="absolute top-8 right-[12%] left-[12%] hidden h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-brand)_0_10px,transparent_10px_20px)] opacity-40 lg:block" />
      <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" stagger={0.15}>
        {items.map((s, i) => (
          <StaggerItem key={s.title} className="group relative text-center">
            <div className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-white text-brand shadow-soft transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-brand group-hover:text-white">
              <s.icon className="size-7" />
              <span className="absolute -top-2.5 -right-2.5 grid size-7 place-items-center rounded-full bg-navy text-xs font-extrabold text-white">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-6 text-lg font-extrabold text-navy">{s.title}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">{s.text}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
