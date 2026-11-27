import type { Metadata } from "next";
import Link from "next/link";
import {
  Beaker,
  Box,
  Droplets,
  FlaskConical,
  MessageSquareQuote,
  Package,
  Palette,
  PenTool,
  Rocket,
  Shapes,
  Sparkles,
  Tag,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeatureGrid } from "@/components/shared/feature-grid";
import { Steps } from "@/components/shared/steps";
import { SoapBlock } from "@/components/shared/soap-block";
import { CtaBand } from "@/components/home/cta-band";

export const metadata: Metadata = {
  title: "Private Label & Custom Soap Base",
  description:
    "Launch your own soap brand with SoapBase private label manufacturing: custom formulations, colours, fragrances, moulding and branded packaging.",
};

const OFFER = [
  { icon: FlaskConical, title: "Custom formulations", text: "Adjust clarity, hardness, lather and skin-feel to match your brand's spec." },
  { icon: Palette, title: "Colours & finishes", text: "Pantone-matched colours, swirls, layers, shimmer and opaque or clear finishes." },
  { icon: Droplets, title: "Fragrance & actives", text: "Add fragrance oils, essential oils, botanicals, scrubs and skin-loving actives." },
  { icon: Shapes, title: "Custom moulding", text: "Choose from our mould library or create a signature shape with your logo embossed." },
  { icon: Package, title: "Wrapping & packaging", text: "Shrink wrap, printed sleeves, boxes and gift sets, ready for retail shelves." },
  { icon: Tag, title: "Your brand label", text: "Products made and labelled under your brand name, with ingredient lists." },
];

const STEPS = [
  { icon: MessageSquareQuote, title: "Brief", text: "Share your idea, target customer, budget and expected volumes." },
  { icon: Beaker, title: "Sampling", text: "We develop 2–3 samples for you to test and refine within about 10 days." },
  { icon: PenTool, title: "Approve & brand", text: "Finalise the formula and packaging design, and approve a pre-production sample." },
  { icon: Rocket, title: "Production", text: "We manufacture, pack and deliver your branded soaps, ready to sell." },
];

export default function PrivateLabelPage() {
  return (
    <>
      <PageHero
        eyebrow="Private Label"
        title={
          <>
            Your brand. <span className="text-gradient">Our expertise.</span>
          </>
        }
        description="Launch or expand a soap range without building a factory. We formulate, produce and pack premium soaps under your own brand name."
        crumbs={[{ label: "Services", href: "/services" }, { label: "Private Label" }]}
        aside={
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="animate-float absolute top-[6%] left-[8%] w-[54%]">
              <SoapBlock color="#ecc98a" />
            </div>
            <div className="animate-float-slow absolute top-[34%] right-[2%] w-[50%] [animation-delay:1.2s]">
              <SoapBlock color="#bfe6a8" translucent />
            </div>
            <div className="animate-float absolute bottom-[4%] left-[18%] w-[44%] [animation-delay:2.4s]">
              <SoapBlock color="#f6f4ee" />
            </div>
          </div>
        }
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn btn-primary">
            Start your project
          </Link>
          <Link href="/quality" className="btn btn-ghost-light">
            Our quality standards
          </Link>
        </div>
      </PageHero>

      <section className="container-x pb-20 sm:pb-28">
        <SectionHeading
          eyebrow="What we offer"
          title="From formula to finished, branded product"
          description="Pick the services you need: just a custom base, or a complete retail-ready product."
        />
        <FeatureGrid items={OFFER} className="mt-14" />
      </section>

      <section className="cv-auto bg-mist py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="The process" title="Launch your range in 4 steps" />
          <div className="mt-16">
            <Steps items={STEPS} />
          </div>
        </div>
      </section>

      <section className="cv-auto container-x py-20 sm:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            align="left"
            eyebrow="Minimums"
            title="Flexible minimums for growing brands"
            description="Custom bases start from 100 kg. Finished, packed private label soaps start from 1,000 bars per design. Contact us for exact pricing on your project."
          />
          <Reveal delay={0.1}>
            <div className="glow-border rounded-4xl">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-4xl bg-navy/8">
                {[
                  { icon: Box, value: "100 kg", label: "Custom base MOQ" },
                  { icon: Sparkles, value: "1,000", label: "Bars per design" },
                  { icon: Beaker, value: "~10 days", label: "Sample turnaround" },
                  { icon: Rocket, value: "3–4 weeks", label: "Production lead time" },
                ].map((s) => (
                  <div key={s.label} className="bg-white p-6 text-center sm:p-8">
                    <s.icon className="mx-auto size-7 text-brand" />
                    <p className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">{s.value}</p>
                    <p className="mt-1 text-xs font-semibold text-muted sm:text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
