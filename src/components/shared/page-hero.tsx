import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Aurora } from "@/components/effects/aurora";
import { Bubbles } from "./bubbles";

type Crumb = { label: string; href?: string };

/**
 * Navy page banner used by every inner page.
 * Entrance animations are CSS-only so the heading paints immediately (good LCP).
 */
export function PageHero({
  title,
  description,
  crumbs = [],
  eyebrow,
  children,
  aside,
}: {
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  eyebrow?: string;
  children?: ReactNode;
  /** Optional visual shown on the right on large screens */
  aside?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pt-36 pb-20 sm:pt-40 sm:pb-24">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#0d2c50_0%,#0a2341_100%)]" />
      <Aurora />
      <div className="grid-pattern absolute inset-0 -z-10" />
      <Bubbles count={7} className="-z-10 opacity-60" />

      <div className={cn("container-x", Boolean(aside) && "grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]")}>
        <div>
          <nav
            aria-label="Breadcrumb"
            className="animate-fade-up flex flex-wrap items-center gap-1.5 text-sm text-white/60"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" />
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-brand-400">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          {eyebrow && (
            <p className="animate-fade-up mt-6 text-xs font-extrabold tracking-[0.2em] text-brand-400 uppercase [animation-delay:0.05s]">
              {eyebrow}
            </p>
          )}
          <h1
            className={cn(
              "animate-fade-up max-w-4xl text-4xl font-extrabold tracking-tight text-balance text-white [animation-delay:0.1s] sm:text-5xl lg:text-6xl",
              eyebrow ? "mt-3" : "mt-5",
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="animate-fade-up mt-5 max-w-2xl text-base leading-relaxed text-white/70 [animation-delay:0.2s] sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className="animate-fade-up [animation-delay:0.3s]">{children}</div>}
        </div>
        {aside && <div className="animate-scale-in hidden [animation-delay:0.2s] lg:block">{aside}</div>}
      </div>

      <svg
        className="absolute -bottom-px left-0 h-10 w-full text-white sm:h-16"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="currentColor" d="M0 80V40C240 0 480 0 720 30s480 50 720 10v40H0Z" />
      </svg>
    </section>
  );
}
