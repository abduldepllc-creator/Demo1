import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  Boxes,
  Building2,
  ClipboardList,
  FlaskConical,
  Gift,
  Handshake,
  Headset,
  Hotel,
  MessageSquareQuote,
  Microscope,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Tag,
  Truck,
  Wallet,
} from "lucide-react";
import { getCategoriesWithCounts, getFeaturedProducts } from "@/db/queries/catalog";
import { CITIES, STATS } from "@/constants";
import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { CategoryCard } from "@/components/home/category-card";
import { CtaBand } from "@/components/home/cta-band";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { Counter } from "@/components/shared/counter";
import { PakistanFlag } from "@/components/shared/icons";

const TRUST = [
  { icon: ShieldCheck, title: "High Quality", text: "Lab-tested, consistent batches" },
  { icon: Boxes, title: "Bulk Supply", text: "From 20 kg to multi-ton orders" },
  { icon: Handshake, title: "Trusted Supplier", text: "850+ businesses served" },
  { icon: null, title: "Proudly Pakistani", text: "Made & shipped locally" },
];

const WHY = [
  { icon: FlaskConical, title: "Consistent Quality", text: "Every batch is made to the same tested formula, so your soaps look and perform the same every time." },
  { icon: BadgePercent, title: "Factory-Direct Pricing", text: "Buy straight from the source with transparent tiered pricing — the more you order, the more you save." },
  { icon: Truck, title: "Nationwide Delivery", text: "Reliable dispatch to 60+ cities via trusted cargo partners, securely packed in sealed cartons." },
  { icon: Sparkles, title: "Custom Formulations", text: "Need a specific clarity, hardness, colour or additive? We develop custom bases for larger orders." },
  { icon: Microscope, title: "Lab-Tested Batches", text: "pH, clarity, hardness and melt-point checked for every production run, with batch numbers." },
  { icon: Headset, title: "Dedicated Support", text: "A real account manager on WhatsApp and phone to help with orders, samples and technical queries." },
];

const STEPS = [
  { icon: ClipboardList, title: "Choose your base", text: "Browse our catalogue and shortlist the soap bases that suit your products." },
  { icon: MessageSquareQuote, title: "Request a quote", text: "Share quantities and city — get a tailored wholesale quote within 24 hours." },
  { icon: Wallet, title: "Confirm & pay", text: "Approve the quote and pay via bank transfer. Samples available on request." },
  { icon: PackageCheck, title: "Fast dispatch", text: "Your order is packed in sealed cartons and dispatched in 48–72 hours." },
];

const INDUSTRIES = [
  { icon: Sparkles, label: "Handmade Soap Makers" },
  { icon: Building2, label: "Cosmetic & Skincare Brands" },
  { icon: Hotel, label: "Hotels & Hospitality" },
  { icon: Store, label: "Wholesalers & Resellers" },
  { icon: Gift, label: "Gift & Craft Studios" },
  { icon: Tag, label: "Private & White Label" },
];

const TESTIMONIALS = [
  {
    quote:
      "The transparent base is genuinely crystal clear and doesn't sweat even in Karachi's humidity. We've moved our entire production to SoapBase.",
    name: "Ayesha Siddiqui",
    role: "Founder, Glow Naturals — Karachi",
  },
  {
    quote:
      "Consistent quality batch after batch and the bulk pricing is the best we found. Delivery to Peshawar always arrives on time.",
    name: "Hamza Khan",
    role: "Procurement Lead, Khyber Cosmetics",
  },
  {
    quote:
      "Their goat milk and shea bases helped us launch a premium range in weeks. The team on WhatsApp is incredibly responsive.",
    name: "Sana Malik",
    role: "Owner, The Soap Studio — Lahore",
  },
];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getCategoriesWithCounts(), getFeaturedProducts()]);

  return (
    <>
      <Hero />

      {/* Trust strip */}
      <section className="relative z-10 -mt-20 sm:-mt-24">
        <div className="container-x">
          <Stagger className="grid grid-cols-2 gap-3 rounded-3xl border border-navy/5 bg-white p-3 shadow-lift sm:gap-4 sm:p-4 lg:grid-cols-4">
            {TRUST.map((t) => (
              <StaggerItem key={t.title}>
                <div className="group flex h-full flex-col items-center gap-3 rounded-2xl p-4 text-center transition-colors hover:bg-mist sm:flex-row sm:text-left lg:p-5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-navy text-white transition-all duration-500 group-hover:rotate-6 group-hover:bg-brand sm:size-14">
                    {t.icon ? <t.icon className="size-6 sm:size-7" /> : <PakistanFlag className="h-5 w-auto sm:h-6" />}
                  </span>
                  <span>
                    <span className="block text-sm font-extrabold text-navy sm:text-base">{t.title}</span>
                    <span className="block text-xs text-muted sm:text-sm">{t.text}</span>
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container-x scroll-mt-28 py-20 sm:py-28">
        <SectionHeading
          eyebrow="Our Soap Bases"
          title={
            <>
              Six premium bases. <span className="text-brand">Endless possibilities.</span>
            </>
          }
          description="From crystal-clear glycerin to nourishing goat milk, every SoapBase is ready to melt, pour and create. Bulk packs from 20 kg."
        />
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {categories.map((c) => (
            <StaggerItem key={c.slug}>
              <CategoryCard {...c} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Marquee */}
      <section className="relative -rotate-1 bg-brand py-5 text-white shadow-glow sm:py-6" aria-hidden="true">
        <Marquee items={categories.map((c) => c.name)} />
      </section>

      {/* Featured products */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              eyebrow="Best Sellers"
              title="Featured wholesale products"
              description="Our most-ordered bases, trusted by soap makers and brands across Pakistan."
            />
            <Reveal>
              <Link href="/products" className="btn btn-navy group">
                View all products
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {featured.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Stats */}
      <section className="relative isolate overflow-hidden bg-navy py-20 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(41,157,54,0.3),transparent_70%)]" />
        <div className="grid-pattern absolute inset-0 -z-10" />
        <div className="container-x">
          <Stagger className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
            {STATS.map((s) => (
              <StaggerItem key={s.label} className="text-center">
                <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm font-semibold text-white/60 sm:text-base">{s.label}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-16 border-t border-white/10 pt-10">
            <p className="text-center text-xs font-bold tracking-[0.2em] text-brand-400 uppercase">
              Delivering across Pakistan
            </p>
            <Marquee items={[...CITIES]} className="mt-5 text-white/40 [&_span]:text-base [&_span]:sm:text-lg" />
          </Reveal>
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-x py-20 sm:py-28">
        <SectionHeading
          eyebrow="Why SoapBase"
          title="The wholesale partner serious soap makers rely on"
          description="We don't just sell soap base — we help Pakistani brands scale with reliable raw materials and real support."
        />
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <StaggerItem key={w.title}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-navy/8 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:bg-navy hover:shadow-lift">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand transition-all duration-500 group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                  <w.icon className="size-7" />
                </span>
                <h3 className="mt-6 text-lg font-extrabold text-navy transition-colors duration-500 group-hover:text-white">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/70">
                  {w.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Process */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="How It Works"
            title="Bulk ordering made simple"
            description="Four easy steps from enquiry to delivery at your door."
          />
          <div className="relative mt-16">
            <div className="absolute top-8 right-[12%] left-[12%] hidden h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-brand)_0_10px,transparent_10px_20px)] opacity-40 lg:block" />
            <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" stagger={0.15}>
              {STEPS.map((s, i) => (
                <StaggerItem key={s.title} className="relative text-center">
                  <div className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-white text-brand shadow-soft">
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
        </div>
      </section>

      {/* Industries */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            align="left"
            eyebrow="Who We Serve"
            title="Supplying every kind of soap business"
            description="Whether you pour 20 kg a month or several tons, we have the right base, packaging and pricing for your operation."
          />
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4" stagger={0.07}>
            {INDUSTRIES.map((ind) => (
              <StaggerItem key={ind.label}>
                <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-navy/8 bg-white p-5 text-center transition-all duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-soft">
                  <span className="grid size-12 place-items-center rounded-xl bg-navy-50 text-navy transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
                    <ind.icon className="size-6" />
                  </span>
                  <span className="text-sm font-bold text-navy">{ind.label}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative isolate overflow-hidden bg-navy py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_60%_at_100%_100%,rgba(41,157,54,0.3),transparent_70%)]" />
        <div className="container-x">
          <SectionHeading
            light
            eyebrow="Testimonials"
            title="Trusted by brands across Pakistan"
            description="Here's what our wholesale customers say about working with SoapBase."
          />
          <Stagger className="mt-14 grid gap-5 md:grid-cols-3" stagger={0.15}>
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.name}>
                <figure className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/10">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 text-base leading-relaxed text-white/85">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                    <span className="grid size-11 place-items-center rounded-full bg-linear-to-br from-brand-400 to-brand-700 font-extrabold text-white">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <span>
                      <span className="block font-bold text-white">{t.name}</span>
                      <span className="block text-xs text-white/60">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
