import type { Metadata } from "next";
import { Building, Clock, MapPin, Package, PackageCheck, ShieldCheck, Truck, Warehouse } from "lucide-react";
import { CITIES } from "@/constants";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeatureGrid } from "@/components/shared/feature-grid";
import { CtaBand } from "@/components/home/cta-band";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "SoapBase Pakistan delivers bulk soap base to 60+ cities. Learn about dispatch times, delivery zones, packaging and warehouse collection.",
};

const ZONES = [
  { zone: "Lahore (local)", time: "Same / next day", note: "Our own delivery van, or self-collection" },
  { zone: "Punjab", time: "1 – 2 working days", note: "Faisalabad, Multan, Sialkot, Gujranwala and more" },
  { zone: "Islamabad / Rawalpindi & KPK", time: "2 – 3 working days", note: "Peshawar, Abbottabad, Mardan and more" },
  { zone: "Sindh", time: "2 – 4 working days", note: "Karachi, Hyderabad, Sukkur and more" },
  { zone: "Balochistan & remote areas", time: "3 – 6 working days", note: "Quetta and other cargo-served cities" },
];

const PACKING = [
  { icon: Package, title: "Shrink-wrapped blocks", text: "Every block is sealed against moisture and dust straight after production." },
  { icon: PackageCheck, title: "Sealed cartons", text: "Strong corrugated cartons, labelled with product, weight and batch number." },
  { icon: ShieldCheck, title: "Palletised bulk loads", text: "Orders over 500 kg are palletised and stretch-wrapped for safe handling." },
];

export default function ShippingPage() {
  return (
    <>
      <PageHero
        eyebrow="Shipping & Delivery"
        title={
          <>
            Delivered across Pakistan, <span className="text-gradient">safely and on time</span>
          </>
        }
        description="Orders are dispatched within 48–72 hours of payment confirmation through trusted cargo partners, with tracking details shared on WhatsApp."
        crumbs={[{ label: "Services", href: "/services" }, { label: "Shipping & Delivery" }]}
      />

      {/* Highlights */}
      <section className="container-x pb-16">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Clock, value: "48–72h", label: "Dispatch time" },
            { icon: MapPin, value: "60+", label: "Cities served" },
            { icon: Truck, value: "Tracked", label: "Cargo shipments" },
            { icon: Warehouse, value: "Lahore", label: "Self-collection" },
          ].map((h) => (
            <StaggerItem key={h.label}>
              <div className="spotlight flex items-center gap-4 overflow-hidden rounded-3xl border border-navy/8 bg-white p-5 shadow-soft">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand">
                  <h.icon className="size-6" />
                </span>
                <span>
                  <span className="block text-xl font-extrabold text-navy">{h.value}</span>
                  <span className="block text-sm text-muted">{h.label}</span>
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Zones */}
      <section className="cv-auto bg-mist py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Delivery zones" title="Estimated delivery times" description="Times are counted from dispatch. Remote areas may take longer." />
          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-4xl border border-navy/8 bg-white shadow-soft">
              {ZONES.map((z, i) => (
                <div
                  key={z.zone}
                  className="group grid items-center gap-2 border-b border-navy/8 px-6 py-5 transition-colors last:border-0 hover:bg-mist/60 sm:grid-cols-[1.2fr_0.8fr_1.5fr] sm:gap-6 sm:px-8"
                >
                  <p className="flex items-center gap-3 font-extrabold text-navy">
                    <span className="grid size-8 place-items-center rounded-full bg-navy text-xs text-white transition-colors group-hover:bg-brand">
                      {i + 1}
                    </span>
                    {z.zone}
                  </p>
                  <p className="font-bold text-brand">{z.time}</p>
                  <p className="text-sm text-muted">{z.note}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Packing */}
      <section className="cv-auto container-x py-20 sm:py-28">
        <SectionHeading eyebrow="Packaging" title="Packed to arrive perfect" />
        <FeatureGrid items={PACKING} className="mt-14" />
      </section>

      {/* Cities + collection */}
      <section className="cv-auto relative isolate overflow-hidden bg-navy py-20 sm:py-24">
        <div className="dot-pattern-light absolute inset-0 -z-10" />
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" light eyebrow="Coverage" title="Major cities we deliver to" />
            <Stagger className="mt-8 flex flex-wrap gap-2" stagger={0.04}>
              {CITIES.map((c) => (
                <StaggerItem key={c}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-brand hover:bg-brand">
                    <MapPin className="size-3.5" /> {c}
                  </span>
                </StaggerItem>
              ))}
              <StaggerItem>
                <span className="inline-flex rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">+ 48 more</span>
              </StaggerItem>
            </Stagger>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <Building className="size-10 text-brand-400" />
              <h3 className="mt-5 text-2xl font-extrabold text-white">Warehouse self-collection</h3>
              <p className="mt-3 text-white/70">
                Prefer to collect? Pick up from our Lahore warehouse at {siteConfig.contact.address}. Collection hours:{" "}
                {siteConfig.contact.hours}.
              </p>
              <p className="mt-4 text-sm text-white/60">Please book a collection slot with our sales team at least 24 hours in advance.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
