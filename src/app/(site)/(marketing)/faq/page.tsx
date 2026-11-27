import type { Metadata } from "next";
import { MessageCircleQuestion } from "lucide-react";
import { ALL_FAQS, FAQ_GROUPS } from "@/content/faqs";
import { whatsappLink } from "@/config/site";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/shared/reveal";
import { Faq } from "@/components/contact/faq";
import { WhatsAppIcon } from "@/components/shared/icons";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about ordering bulk soap base from SoapBase Pakistan: MOQ, pricing, delivery, samples, storage and private label.",
};

// Structured data so search engines can show rich FAQ results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ALL_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Help Centre"
        title={
          <>
            Frequently asked <span className="text-gradient">questions</span>
          </>
        }
        description="Everything you need to know about ordering, delivery, quality and private label. Can't find an answer? Our team is one message away."
        crumbs={[{ label: "FAQ" }]}
      >
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="FAQ topics">
          {FAQ_GROUPS.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-brand hover:bg-brand"
            >
              {g.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="container-x pb-20 sm:pb-28">
        <div className="mx-auto max-w-4xl space-y-14">
          {FAQ_GROUPS.map((g) => (
            <Reveal key={g.id}>
              <div id={g.id} className="scroll-mt-28">
                <h2 className="mb-5 flex items-center gap-3 text-2xl font-extrabold text-navy">
                  <span className="h-8 w-1.5 rounded-full bg-brand" />
                  {g.title}
                </h2>
                <Faq items={g.items} defaultOpen={null} />
              </div>
            </Reveal>
          ))}

          <Reveal>
            <div className="relative isolate flex flex-col items-center gap-5 overflow-hidden rounded-4xl bg-navy p-8 text-center sm:flex-row sm:text-left">
              <div className="absolute -top-16 -right-16 -z-10 size-56 rounded-full bg-brand/30 blur-3xl" />
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-brand-400">
                <MessageCircleQuestion className="size-7" />
              </span>
              <div className="flex-1">
                <p className="text-xl font-extrabold text-white">Still have a question?</p>
                <p className="mt-1 text-sm text-white/70">Message our team on WhatsApp for a quick answer.</p>
              </div>
              <a
                href={whatsappLink("Hi SoapBase! I have a question:")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#25D366] text-white hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="size-5" /> Ask on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
