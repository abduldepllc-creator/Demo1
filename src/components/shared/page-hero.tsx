import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Bubbles } from "./bubbles";
import { Reveal } from "./reveal";

type Crumb = { label: string; href?: string };

export function PageHero({
  title,
  description,
  crumbs = [],
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pt-36 pb-20 sm:pt-40 sm:pb-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_0%,rgba(41,157,54,0.35),transparent_60%),radial-gradient(50%_70%_at_0%_100%,rgba(59,130,246,0.25),transparent_60%)]" />
      <div className="grid-pattern absolute inset-0 -z-10" />
      <Bubbles count={7} className="-z-10 opacity-60" />

      <div className="container-x">
        <Reveal>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
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
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>
          )}
          {children}
        </Reveal>
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
