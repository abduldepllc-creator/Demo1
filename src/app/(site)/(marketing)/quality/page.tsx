import type { Metadata } from "next";
import {
  Droplet,
  Eye,
  FileCheck2,
  Gauge,
  Hash,
  Layers,
  Microscope,
  ScanSearch,
  ShieldCheck,
  Thermometer,
  Timer,
  Waves,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeatureGrid } from "@/components/shared/feature-grid";
import { CtaBand } from "@/components/home/cta-band";

export const metadata: Metadata = {
  title: "Quality Assurance",
  description:
    "How SoapBase Pakistan tests every batch of soap base for clarity, pH, hardness, melt point and stability, with full batch traceability.",
};

const TESTS = [
  { icon: Eye, title: "Clarity & colour", text: "Visual and light-transmission checks against a master reference sample." },
  { icon: Droplet, title: "pH level", text: "Measured on every batch to keep it within the specified 9.0–10.0 range." },
  { icon: Thermometer, title: "Melting point", text: "Confirms a smooth, predictable melt between 58 and 66 °C." },
  { icon: Gauge, title: "Hardness", text: "Ensures bars unmould cleanly and stay firm during use." },
  { icon: Waves, title: "Lather test", text: "Checks foam volume, bubble size and rinse-off feel." },
  { icon: Timer, title: "Sweat test", text: "A 48-hour humidity test confirms our low-sweat performance." },
];

const PILLARS = [
  { icon: Layers, title: "Controlled raw materials", text: "Ingredients come from approved suppliers and are checked on arrival." },
  { icon: Microscope, title: "In-house QC lab", text: "Every production run is tested before it is released for packing." },
  { icon: Hash, title: "Batch traceability", text: "Batch numbers on every carton let us trace each order back to production." },
  { icon: FileCheck2, title: "Spec sheets", text: "Technical data sheets and INCI ingredient lists are available on request." },
];

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality Assurance"
        title={
          <>
            Consistent quality, <span className="text-gradient">batch after batch</span>
          </>
        }
        description="Your customers expect the same soap every time. That is why every batch of SoapBase is tested before it leaves our facility."
        crumbs={[{ label: "Services", href: "/services" }, { label: "Quality Assurance" }]}
      />

      <section className="container-x pb-20 sm:pb-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our standards"
              title="Four pillars of quality"
              description="Quality is built into every step, from incoming raw materials to the sealed carton at your door."
            />
            <Reveal delay={0.1}>
              <div className="relative isolate mt-10 overflow-hidden rounded-4xl bg-navy p-8 text-white">
                <div className="absolute -right-10 -bottom-10 -z-10 size-48 rounded-full bg-brand/30 blur-3xl" />
                <ShieldCheck className="size-10 text-brand-400" />
                <p className="mt-4 text-5xl font-extrabold">99.6%</p>
                <p className="mt-1 text-white/70">of batches pass QC on the first test</p>
              </div>
            </Reveal>
          </div>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <StaggerItem key={p.title}>
                <div className="spotlight group h-full overflow-hidden rounded-3xl border border-navy/8 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid size-12 place-items-center rounded-2xl bg-navy text-white transition-colors duration-500 group-hover:bg-brand">
                    <p.icon className="size-6" />
                  </span>
                  <h3 className="mt-5 font-extrabold text-navy">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="cv-auto bg-mist py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Batch testing"
            title="What we test on every batch"
            description="A batch is released for packing only after it passes every check below."
          />
          <FeatureGrid items={TESTS} className="mt-14" />
          <Reveal>
            <div className="mx-auto mt-12 flex max-w-2xl items-center gap-4 rounded-3xl border border-brand/20 bg-white p-5 sm:p-6">
              <ScanSearch className="size-10 shrink-0 text-brand" />
              <p className="text-sm text-muted sm:text-base">
                <span className="font-bold text-navy">Need documentation?</span> Ask for a technical data sheet or batch
                certificate with any wholesale order.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
