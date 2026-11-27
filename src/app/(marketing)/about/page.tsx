import type { Metadata } from "next";
import Image from "next/image";
import { Award, Factory, HeartHandshake, Leaf, Target, Users } from "lucide-react";
import { STATS } from "@/constants";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Counter } from "@/components/shared/counter";
import { CtaBand } from "@/components/home/cta-band";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "SoapBase Pakistan is a Lahore-based wholesale supplier of premium raw soap base, serving soap makers, cosmetic brands and resellers nationwide.",
};

const VALUES = [
  { icon: Award, title: "Quality first", text: "Every batch is tested for clarity, pH, hardness and melt point before it leaves our facility." },
  { icon: HeartHandshake, title: "Honest partnership", text: "Transparent pricing, clear lead times and real people who pick up the phone." },
  { icon: Leaf, title: "Skin-friendly formulas", text: "Glycerin-rich bases with natural additives and SLS-free options for clean-label brands." },
  { icon: Users, title: "Built for local makers", text: "From home-based crafters to national brands — we grow alongside Pakistani businesses." },
];

const MILESTONES = [
  { year: "2014", title: "Humble beginnings", text: "Started supplying transparent soap base to small soap makers in Lahore." },
  { year: "2017", title: "Our own production", text: "Opened our first dedicated soap base production line with in-house QC." },
  { year: "2021", title: "Nationwide reach", text: "Expanded distribution to 40+ cities with reliable cargo partnerships." },
  { year: "2025", title: "Six premium bases", text: "Launched goat milk, aloe vera, shea butter and charcoal ranges." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Pakistan&apos;s home of <span className="text-gradient">premium soap base</span>
          </>
        }
        description="We help soap makers and brands across Pakistan create beautiful products with dependable, wholesale-priced raw soap base."
        crumbs={[{ label: "About Us" }]}
      />

      {/* Story */}
      <section className="container-x pb-20 sm:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal x={-30} y={0}>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rotate-2 rounded-[2.5rem] bg-linear-to-br from-brand/20 to-navy/10" />
              <div className="rounded-[2rem] border border-navy/5 bg-white p-6 shadow-lift sm:p-10">
                <Image
                  src="/images/logo-full.png"
                  alt="SoapBase.pk — Premium Raw Soap Base in Bulk"
                  width={1600}
                  height={740}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Built by makers, for makers
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              <p>
                SoapBase Pakistan started with a simple frustration: local soap makers couldn&apos;t find consistent,
                affordable melt &amp; pour base without importing it. So we started making it ourselves.
              </p>
              <p>
                Today we supply hundreds of handmade soap studios, cosmetic brands, hotels and resellers across the
                country — with six premium bases, transparent wholesale pricing and dispatch within 72 hours.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-mist p-5">
                <Target className="size-7 text-brand" />
                <h3 className="mt-3 font-extrabold text-navy">Our mission</h3>
                <p className="mt-1 text-sm text-muted">Make premium soap base accessible to every Pakistani maker.</p>
              </div>
              <div className="rounded-2xl bg-mist p-5">
                <Factory className="size-7 text-brand" />
                <h3 className="mt-3 font-extrabold text-navy">Our promise</h3>
                <p className="mt-1 text-sm text-muted">Consistent batches, honest pricing, on-time delivery.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy py-16 sm:py-20">
        <Stagger className="container-x grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <StaggerItem key={s.label} className="text-center">
              <p className="text-4xl font-extrabold text-white sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-semibold text-white/60">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Values */}
      <section className="container-x py-20 sm:py-28">
        <SectionHeading eyebrow="Our values" title="What we stand for" />
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <StaggerItem key={v.title}>
              <div className="group h-full rounded-3xl border border-navy/8 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand transition-all duration-500 group-hover:rotate-6 group-hover:bg-brand group-hover:text-white">
                  <v.icon className="size-7" />
                </span>
                <h3 className="mt-6 text-lg font-extrabold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Timeline */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Our journey" title="A decade of growing with Pakistani makers" />
          <div className="relative mx-auto mt-14 max-w-3xl">
            <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-linear-to-b from-brand via-navy/30 to-transparent sm:left-1/2 sm:-translate-x-1/2" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <Reveal key={m.year} x={i % 2 ? 30 : -30} y={0}>
                  <div className={`relative flex gap-6 sm:w-1/2 ${i % 2 ? "sm:ml-auto sm:pl-10" : "sm:pr-10 sm:text-right"}`}>
                    <span
                      className={`absolute top-1 left-5 size-4 -translate-x-1/2 rounded-full border-4 border-mist bg-brand sm:left-auto ${
                        i % 2 ? "sm:-left-2 sm:translate-x-0" : "sm:-right-2 sm:translate-x-0"
                      }`}
                    />
                    <div className="ml-12 rounded-3xl bg-white p-6 shadow-soft sm:ml-0">
                      <p className="text-sm font-extrabold text-brand">{m.year}</p>
                      <h3 className="mt-1 text-lg font-extrabold text-navy">{m.title}</h3>
                      <p className="mt-1 text-sm text-muted">{m.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
