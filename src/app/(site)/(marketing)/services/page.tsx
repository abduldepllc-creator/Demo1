import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgePercent, Check, Microscope, Tag, Truck } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { CtaBand } from "@/components/home/cta-band";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Wholesale accounts, private label manufacturing, lab-tested quality assurance and nationwide delivery: everything a soap business needs from one supplier.",
};

const SERVICES = [
  {
    href: "/wholesale",
    icon: BadgePercent,
    title: "Wholesale Program",
    text: "Tiered bulk pricing, a dedicated account manager and credit terms for repeat buyers.",
    points: ["Up to 12% volume discount", "Mixed-base orders", "Priority dispatch"],
  },
  {
    href: "/private-label",
    icon: Tag,
    title: "Private Label",
    text: "Custom formulations and finished soaps under your own brand, from recipe to packaging.",
    points: ["Custom colour, scent & additives", "Moulding & wrapping", "Branded packaging"],
  },
  {
    href: "/quality",
    icon: Microscope,
    title: "Quality Assurance",
    text: "Every batch is tested for clarity, pH, hardness and melt point, with full batch traceability.",
    points: ["7-point batch testing", "Batch numbers on every carton", "Spec sheets on request"],
  },
  {
    href: "/shipping",
    icon: Truck,
    title: "Shipping & Delivery",
    text: "Moisture-proof packing and reliable cargo partners delivering to 60+ cities nationwide.",
    points: ["Dispatch in 48–72 hours", "Shrink-wrapped & sealed", "Warehouse self-collection"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title={
          <>
            Everything your soap business needs, <span className="text-gradient">under one roof</span>
          </>
        }
        description="From your first 20 kg order to multi-ton private label production, our team helps Pakistani makers and brands grow with dependable raw materials and real support."
        crumbs={[{ label: "Services" }]}
      />

      <section className="container-x pb-20 sm:pb-28">
        <Stagger className="grid gap-6 md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <StaggerItem key={s.href}>
              <Link
                href={s.href}
                className="spotlight group relative flex h-full flex-col overflow-hidden rounded-4xl border border-navy/8 bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift sm:p-10"
              >
                <span className="absolute top-6 right-8 text-7xl font-extrabold text-navy/5 transition-colors duration-500 group-hover:text-brand/10">
                  0{i + 1}
                </span>
                <span className="grid size-16 place-items-center rounded-2xl bg-navy text-white transition-all duration-500 group-hover:rotate-6 group-hover:bg-brand">
                  <s.icon className="size-8" />
                </span>
                <h2 className="mt-7 text-2xl font-extrabold text-navy">{s.title}</h2>
                <p className="mt-3 text-muted">{s.text}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm font-semibold text-navy">
                      <span className="grid size-5 place-items-center rounded-full bg-brand-50 text-brand">
                        <Check className="size-3.5" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-8 inline-flex items-center gap-2 font-bold text-brand">
                  Explore {s.title.toLowerCase()}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand />
    </>
  );
}
