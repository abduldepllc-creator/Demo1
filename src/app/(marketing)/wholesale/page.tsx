import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgePercent,
  Boxes,
  Check,
  CreditCard,
  Headset,
  PackageCheck,
  Repeat,
  ClipboardList,
  MessageSquareQuote,
  Wallet,
  Zap,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeatureGrid } from "@/components/shared/feature-grid";
import { Steps } from "@/components/shared/steps";
import { CtaBand } from "@/components/home/cta-band";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wholesale Program",
  description:
    "Join the SoapBase wholesale program: tiered bulk pricing with up to 12% off, mixed-base orders, credit terms and a dedicated account manager.",
};

const TIERS = [
  {
    name: "Starter",
    range: "20 – 99 kg",
    discount: "Base price",
    text: "Ideal for home-based makers and new brands testing the market.",
    perks: ["All 12 soap bases", "1 kg samples available", "WhatsApp support"],
  },
  {
    name: "Growth",
    range: "100 – 499 kg",
    discount: "5% off",
    text: "For growing brands with regular monthly production.",
    perks: ["Everything in Starter", "Mixed-base pricing", "Priority dispatch"],
  },
  {
    name: "Business",
    range: "500 – 999 kg",
    discount: "8% off",
    text: "For established brands, resellers and hotel suppliers.",
    perks: ["Everything in Growth", "Dedicated account manager", "Scheduled deliveries"],
    popular: true,
  },
  {
    name: "Enterprise",
    range: "1 ton +",
    discount: "12% off",
    text: "For manufacturers and distributors buying at scale.",
    perks: ["Everything in Business", "Credit terms available", "Custom formulations"],
  },
];

const BENEFITS = [
  { icon: BadgePercent, title: "Volume pricing", text: "Clear per-kg tiers. The more you order, the less you pay, with no hidden charges." },
  { icon: Boxes, title: "Mix & match bases", text: "Combine different bases in one order. Discounts apply to your total weight." },
  { icon: CreditCard, title: "Credit terms", text: "Approved repeat customers can apply for 15–30 day payment terms." },
  { icon: Headset, title: "Account manager", text: "One point of contact for orders, samples, forecasts and technical questions." },
  { icon: Repeat, title: "Scheduled supply", text: "Set up recurring monthly deliveries so you never run out mid-production." },
  { icon: Zap, title: "Priority dispatch", text: "Wholesale accounts are packed first and dispatched within 48 hours." },
];

const STEPS = [
  { icon: ClipboardList, title: "Apply", text: "Send us your business details and expected monthly volume." },
  { icon: MessageSquareQuote, title: "Get your price list", text: "Receive a personalised wholesale price list within 24 hours." },
  { icon: Wallet, title: "Place your first order", text: "Order by WhatsApp, phone or email and pay by bank transfer." },
  { icon: PackageCheck, title: "Grow together", text: "Unlock better tiers, credit terms and scheduled supply as you grow." },
];

export default function WholesalePage() {
  return (
    <>
      <PageHero
        eyebrow="Wholesale Program"
        title={
          <>
            Bulk soap base at <span className="text-gradient">factory-direct prices</span>
          </>
        }
        description="Transparent tiered pricing, flexible ordering and a team that understands soap businesses, whether you buy 20 kg or 20 tons."
        crumbs={[{ label: "Services", href: "/services" }, { label: "Wholesale Program" }]}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn btn-primary">
            Apply for a wholesale account
          </Link>
          <Link href="/products" className="btn btn-ghost-light">
            View price list
          </Link>
        </div>
      </PageHero>

      {/* Tiers */}
      <section className="container-x pb-20 sm:pb-28">
        <SectionHeading
          eyebrow="Pricing tiers"
          title="Simple, transparent volume discounts"
          description="Discounts are applied automatically to every product's per-kg base price."
        />
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((t) => (
            <StaggerItem key={t.name} className="h-full">
              <div className={cn("h-full rounded-4xl", t.popular && "glow-border")}>
                <div
                  className={cn(
                    "spotlight relative flex h-full flex-col overflow-hidden rounded-4xl p-7 transition-all duration-500 hover:-translate-y-1.5",
                    t.popular ? "spotlight-light bg-navy text-white" : "border border-navy/8 bg-white hover:shadow-lift",
                  )}
                >
                  {t.popular && (
                    <span className="absolute top-5 right-5 rounded-full bg-brand px-3 py-1 text-[11px] font-bold tracking-wide uppercase">
                      Most popular
                    </span>
                  )}
                  <p className={cn("text-sm font-bold tracking-wider uppercase", t.popular ? "text-brand-400" : "text-brand")}>
                    {t.name}
                  </p>
                  <p className={cn("mt-3 text-3xl font-extrabold", t.popular ? "text-white" : "text-navy")}>{t.discount}</p>
                  <p className={cn("mt-1 text-sm font-semibold", t.popular ? "text-white/70" : "text-muted")}>{t.range}</p>
                  <p className={cn("mt-4 text-sm leading-relaxed", t.popular ? "text-white/70" : "text-muted")}>{t.text}</p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-sm font-semibold">
                        <Check className={cn("size-4 shrink-0", t.popular ? "text-brand-400" : "text-brand")} />
                        <span className={t.popular ? "text-white" : "text-navy"}>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className={cn("btn mt-8 w-full", t.popular ? "btn-primary" : "btn-outline")}>
                    Get a quote
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal>
          <p className="mt-8 text-center text-sm text-muted">
            Want exact per-kg prices? Every product page has a live{" "}
            <Link href="/products" className="font-bold text-brand underline underline-offset-4">
              bulk price calculator
            </Link>
            .
          </p>
        </Reveal>
      </section>

      {/* Benefits */}
      <section className="cv-auto relative isolate overflow-hidden bg-navy py-20 sm:py-28">
        <div className="dot-pattern-light absolute inset-0 -z-10" />
        <div className="absolute -top-32 left-1/2 -z-10 size-125 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="container-x">
          <SectionHeading light eyebrow="Account benefits" title="Built for businesses that buy in bulk" />
          <FeatureGrid dark items={BENEFITS} className="mt-14" />
        </div>
      </section>

      {/* Steps */}
      <section className="cv-auto bg-mist py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="How to join" title="Open a wholesale account in 4 steps" />
          <div className="mt-16">
            <Steps items={STEPS} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
