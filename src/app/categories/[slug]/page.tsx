import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { ArrowRight, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { getCategories, getCategoryBySlug } from "@/db/queries/catalog";
import { CATEGORY_CONTENT } from "@/content/categories";
import { formatPKR } from "@/lib/utils";
import { PageHero } from "@/components/shared/page-hero";
import { SoapBlock } from "@/components/shared/soap-block";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/products/product-card";
import { CtaBand } from "@/components/home/cta-band";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} — Wholesale in Pakistan`,
    description: `${category.description} Buy ${category.name.toLowerCase()} in bulk from SoapBase Pakistan.`,
  };
}

// The page doesn't await `params` itself. It is read inside <Suspense>, so the shared App Shell
// stays URL-independent and navigation can be instant (Partial Prefetching / Cache Components).
export default function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton variant="grid" />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: Pick<PageProps<"/categories/[slug]">, "params">) {
  const { slug } = await params;
  const [category, all] = await Promise.all([getCategoryBySlug(slug), getCategories()]);
  if (!category) notFound();

  const content = CATEGORY_CONTENT[category.slug];
  const fromPrice = category.products.length ? Math.min(...category.products.map((p) => p.pricePerKg)) : null;
  const minMoq = category.products.length ? Math.min(...category.products.map((p) => p.moq)) : null;
  const others = all.filter((c) => c.slug !== category.slug);

  return (
    <>
      <PageHero
        eyebrow={category.tagline}
        title={category.name}
        description={category.description}
        crumbs={[{ label: "Categories", href: "/categories" }, { label: category.name }]}
        aside={
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-[8%] rounded-full blur-3xl" style={{ background: `${category.color}55` }} />
            <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-white/15" />
            <div className="animate-float relative p-10">
              <SoapBlock color={category.color} translucent={category.translucent} />
            </div>
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          {fromPrice && (
            <span className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/70 backdrop-blur">
              From <span className="font-extrabold text-white">{formatPKR(fromPrice)}/kg</span>
            </span>
          )}
          {minMoq && (
            <span className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/70 backdrop-blur">
              MOQ <span className="font-extrabold text-white">{minMoq} kg</span>
            </span>
          )}
          <span className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white/70 backdrop-blur">
            <span className="font-extrabold text-white">{category.products.length}</span> products
          </span>
        </div>
      </PageHero>

      {/* Products */}
      <section className="container-x pb-20">
        <SectionHeading align="left" eyebrow="Available now" title={`${category.name} range`} />
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {category.products.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Benefits & applications */}
      {content && (
        <section className="cv-auto bg-mist py-20 sm:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading align="left" eyebrow="Why choose it" title={content.headline} />
              <Stagger className="mt-10 space-y-4">
                {content.benefits.map((b) => (
                  <StaggerItem key={b.title}>
                    <div className="spotlight flex gap-4 overflow-hidden rounded-3xl border border-navy/8 bg-white p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
                        <CheckCircle2 className="size-5" />
                      </span>
                      <span>
                        <span className="block font-extrabold text-navy">{b.title}</span>
                        <span className="mt-0.5 block text-sm text-muted">{b.text}</span>
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <div className="space-y-6">
              <Reveal delay={0.1}>
                <div className="relative isolate overflow-hidden rounded-3xl bg-navy p-7 text-white sm:p-8">
                  <div className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-brand/30 blur-3xl" />
                  <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-brand-400 uppercase">
                    <Sparkles className="size-4" /> Ideal for
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {content.applications.map((a) => (
                      <li
                        key={a}
                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition-colors hover:border-brand hover:bg-brand"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="glow-border rounded-3xl">
                  <div className="rounded-3xl bg-white p-7 sm:p-8">
                    <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.18em] text-brand uppercase">
                      <Lightbulb className="size-4" /> Pro tip
                    </p>
                    <p className="mt-3 text-lg leading-relaxed font-semibold text-navy">{content.tip}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* Other categories */}
      <section className="cv-auto container-x py-20 sm:py-24">
        <SectionHeading eyebrow="Explore more" title="Other soap bases" />
        <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {others.map((c) => (
            <StaggerItem key={c.slug}>
              <Link
                href={`/categories/${c.slug}`}
                className="spotlight group flex h-full flex-col items-center overflow-hidden rounded-3xl border border-navy/8 bg-white p-5 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <SoapBlock
                  color={c.color}
                  translucent={c.translucent}
                  className="w-24 transition-transform duration-500 group-hover:-translate-y-1 group-hover:-rotate-6"
                />
                <span className="mt-3 text-sm font-extrabold text-navy">{c.name.replace(" Soap Base", "")}</span>
                <span className="mt-1 flex items-center gap-1 text-xs font-bold text-brand">
                  View <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
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
