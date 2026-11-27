import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { ALL_FAQS } from "@/content/faqs";
import { siteConfig, whatsappLink } from "@/config/site";
import { getProducts } from "@/db/queries/catalog";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { WhatsAppIcon } from "@/components/shared/icons";
import { QuoteForm } from "@/components/contact/quote-form";
import { Faq } from "@/components/contact/faq";

export const metadata: Metadata = {
  title: "Contact & Bulk Quotes",
  description:
    "Request a wholesale quote for bulk soap base. Call, WhatsApp or email SoapBase Pakistan — we reply within 24 hours.",
};

const CHANNELS = [
  { icon: Phone, label: "Call sales", value: siteConfig.contact.phone, href: siteConfig.contact.phoneHref },
  { icon: Mail, label: "Email", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { icon: MapPin, label: "Warehouse", value: siteConfig.contact.address },
  { icon: Clock, label: "Business hours", value: siteConfig.contact.hours },
];

export default async function ContactPage() {
  const products = (await getProducts()).map(({ slug, name }) => ({ slug, name }));

  return (
    <>
      <PageHero
        title={
          <>
            Let&apos;s talk <span className="text-gradient">bulk.</span>
          </>
        }
        description="Get a tailored wholesale quote, request samples or ask our team anything about soap base. We usually reply within a few hours."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="container-x pb-20 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
          <div className="space-y-4">
            <Reveal>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-3xl bg-[#25D366] p-6 text-white shadow-[0_18px_40px_-14px_rgba(37,211,102,0.7)] transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/20">
                  <WhatsAppIcon className="size-8" />
                </span>
                <span>
                  <span className="block text-lg font-extrabold">Fastest: WhatsApp us</span>
                  <span className="block text-sm text-white/85">Instant prices, photos & order updates</span>
                </span>
              </a>
            </Reveal>
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {CHANNELS.map((c) => {
                const inner = (
                  <>
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-navy text-white transition-colors duration-500 group-hover:bg-brand">
                      <c.icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold tracking-wider text-muted uppercase">{c.label}</span>
                      <span className="block font-bold wrap-break-word text-navy">{c.value}</span>
                    </span>
                  </>
                );
                const cls =
                  "group flex h-full items-center gap-4 rounded-3xl border border-navy/8 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft";
                return (
                  <StaggerItem key={c.label}>
                    {c.href ? (
                      <a href={c.href} className={cls}>
                        {inner}
                      </a>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>

          <Reveal delay={0.15}>
            <Suspense fallback={<div className="h-160 animate-pulse rounded-4xl bg-mist" />}>
              <QuoteForm products={products} />
            </Suspense>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Quick answers about ordering, delivery and our soap bases. Can't find yours? Just ask on WhatsApp."
          />
          <Reveal delay={0.1}>
            <Faq items={ALL_FAQS.slice(0, 6)} />
            <Link href="/faq" className="btn btn-outline group mt-6">
              View all FAQs
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
