import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Lightbulb } from "lucide-react";
import { GUIDES, getGuide, type GuideBlock } from "@/content/guides";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { SoapBlock } from "@/components/shared/soap-block";
import { GuideCard, formatDate } from "@/components/guides/guide-card";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.excerpt,
    openGraph: { type: "article", title: guide.title, description: guide.excerpt, publishedTime: guide.date },
  };
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      );
    case "tip":
      return (
        <div className="not-prose my-8 flex gap-4 rounded-3xl border border-brand/20 bg-brand-50 p-5 sm:p-6">
          <Lightbulb className="mt-0.5 size-6 shrink-0 text-brand" />
          <p className="mb-0! font-semibold text-navy">{block.text}</p>
        </div>
      );
  }
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.date,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow={guide.category}
        title={guide.title}
        crumbs={[{ label: "Guides", href: "/guides" }, { label: guide.category }]}
        aside={
          <div className="animate-float mx-auto w-full max-w-xs">
            <SoapBlock color={guide.color} translucent={guide.translucent} />
          </div>
        }
      >
        <p className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-white/70">
          <span>{formatDate(guide.date)}</span>
          <span className="size-1 rounded-full bg-white/40" />
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" /> {guide.readMinutes} min read
          </span>
          <span className="size-1 rounded-full bg-white/40" />
          <span>By the SoapBase team</span>
        </p>
      </PageHero>

      <section className="container-x pb-16">
        <article className="prose-sb mx-auto max-w-3xl">
          <p className="text-xl leading-relaxed font-medium text-navy">{guide.excerpt}</p>
          {guide.body.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </article>

        <Reveal>
          <div className="mx-auto mt-12 flex max-w-3xl flex-col items-start justify-between gap-4 rounded-4xl bg-navy p-7 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="text-xl font-extrabold text-white">Ready to start pouring?</p>
              <p className="mt-1 text-sm text-white/70">Order premium soap base in bulk, from 20 kg.</p>
            </div>
            <Link href="/products" className="btn btn-primary group shrink-0">
              Shop soap base
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="cv-auto bg-mist py-20">
        <div className="container-x">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-2xl font-extrabold text-navy sm:text-3xl">More guides</h2>
            <Link href="/guides" className="flex items-center gap-1.5 text-sm font-bold text-brand">
              <ArrowLeft className="size-4" /> All guides
            </Link>
          </div>
          <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((g) => (
              <StaggerItem key={g.slug}>
                <GuideCard guide={g} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
