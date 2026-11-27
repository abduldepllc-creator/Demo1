import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { GUIDES } from "@/content/guides";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { SoapBlock } from "@/components/shared/soap-block";
import { GuideCard, formatDate } from "@/components/guides/guide-card";
import { CtaBand } from "@/components/home/cta-band";

export const metadata: Metadata = {
  title: "Soap Making Guides",
  description:
    "Free melt & pour soap making guides from SoapBase Pakistan: beginner tutorials, troubleshooting tips and advice on starting a soap business.",
};

export default function GuidesPage() {
  const [featured, ...rest] = GUIDES;

  return (
    <>
      <PageHero
        eyebrow="Learn & Grow"
        title={
          <>
            Soap making <span className="text-gradient">guides</span>
          </>
        }
        description="Practical, no-fluff advice from our team to help you make better soap and build a profitable soap business in Pakistan."
        crumbs={[{ label: "Guides" }]}
      />

      <section className="container-x pb-20 sm:pb-28">
        {/* Featured guide */}
        <Reveal>
          <Link
            href={`/guides/${featured.slug}`}
            className="spotlight group grid overflow-hidden rounded-4xl border border-navy/8 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift lg:grid-cols-2"
          >
            <div
              className="relative flex min-h-64 items-center justify-center overflow-hidden"
              style={{ background: `radial-gradient(circle at 40% 40%, ${featured.color} 0%, #f1f4f2 75%)` }}
            >
              <div className="dot-pattern absolute inset-0 opacity-60" />
              <SoapBlock
                color={featured.color}
                translucent={featured.translucent}
                className="relative w-1/2 transition-transform duration-700 group-hover:-translate-y-3 group-hover:-rotate-6"
              />
              <span className="absolute top-5 left-5 rounded-full bg-navy px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                Featured
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <p className="text-xs font-bold tracking-wider text-brand uppercase">{featured.category}</p>
              <h2 className="mt-3 text-2xl leading-tight font-extrabold text-navy transition-colors group-hover:text-brand-600 sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-muted">{featured.excerpt}</p>
              <p className="mt-6 flex items-center gap-3 text-sm font-semibold text-muted">
                {formatDate(featured.date)}
                <span className="size-1 rounded-full bg-muted/50" />
                <span className="flex items-center gap-1">
                  <Clock className="size-4" /> {featured.readMinutes} min read
                </span>
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand">
                Read the guide
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </Reveal>

        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {rest.map((g) => (
            <StaggerItem key={g.slug}>
              <GuideCard guide={g} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand />
    </>
  );
}
