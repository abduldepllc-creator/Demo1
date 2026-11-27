import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { ArrowLeft, CheckCircle2, Package, ShieldCheck, Star, Truck } from "lucide-react";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/db/queries/catalog";
import { getPriceTiers } from "@/lib/pricing";
import { formatPKR } from "@/lib/utils";
import { PageHero } from "@/components/shared/page-hero";
import { SoapBlock } from "@/components/shared/soap-block";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/products/product-card";
import { QuantityCalculator } from "@/components/products/quantity-calculator";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — Wholesale`,
    description: `${product.shortDescription} Bulk price from ${formatPKR(product.pricePerKg)}/kg, MOQ ${product.moq} kg.`,
  };
}

// The page doesn't await `params` itself. It is read inside <Suspense>, so the shared App Shell
// stays URL-independent and navigation can be instant (Partial Prefetching / Cache Components).
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton variant="detail" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const color = product.color ?? product.category.color;
  const tiers = getPriceTiers(product.moq);

  const specs = [
    ["SKU", product.sku],
    ["Category", product.category.name],
    ["pH level", product.phLevel],
    ["Melting point", product.meltPoint],
    ["Shelf life", product.shelfLife],
    ["Minimum order", `${product.moq} kg`],
    ["Pack sizes", product.packSizes.join(", ")],
    ["Ingredients (INCI)", product.ingredients],
  ];

  return (
    <>
      <PageHero
        title={product.name}
        crumbs={[
          { label: "Products", href: "/products" },
          { label: product.category.name, href: `/categories/${product.category.slug}` },
          { label: product.sku },
        ]}
      />

      <section className="container-x pb-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Visual */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-4xl border border-navy/5"
              style={{ background: `radial-gradient(circle at 50% 40%, ${color}88 0%, #f1f4f2 72%)` }}
            >
              <div className="animate-spin-slow absolute inset-[10%] rounded-full border-2 border-dashed border-navy/10" />
              <div className="animate-float w-[66%]">
                <SoapBlock color={color} translucent={product.category.translucent} />
              </div>
              {product.badge && (
                <span className="absolute top-5 left-5 rounded-full bg-navy px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase">
                  {product.badge}
                </span>
              )}
              <span className="absolute top-5 right-5 rounded-full bg-white/90 px-3 py-1.5 font-mono text-xs font-bold text-navy backdrop-blur">
                {product.sku}
              </span>
              <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2">
                {[
                  { icon: ShieldCheck, label: "Lab tested" },
                  { icon: Package, label: "Sealed packs" },
                  { icon: Truck, label: "48–72h dispatch" },
                ].map((f) => (
                  <span
                    key={f.label}
                    className="flex flex-col items-center gap-1 rounded-2xl bg-white/85 px-2 py-2.5 text-center text-[11px] font-bold text-navy backdrop-blur sm:flex-row sm:justify-center sm:text-xs"
                  >
                    <f.icon className="size-4 text-brand" />
                    {f.label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Details */}
          <div>
            <Reveal delay={0.1}>
              <Link
                href={`/categories/${product.category.slug}`}
                className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-wide text-brand-700 uppercase"
              >
                {product.category.name}
              </Link>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-navy/20"}`}
                    />
                  ))}
                  <span className="ml-1 font-bold text-navy">{product.rating.toFixed(1)}</span>
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-brand-700">
                  <span className="size-2 rounded-full bg-brand" /> {product.inStock ? "In stock" : "Made to order"}
                </span>
              </div>
              <p className="mt-5 text-lg leading-relaxed text-muted">{product.description}</p>

              <div className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-4 rounded-3xl bg-navy p-6 text-white">
                <div>
                  <p className="text-xs font-bold tracking-wider text-white/60 uppercase">Wholesale price</p>
                  <p className="mt-1 text-4xl font-extrabold">
                    {formatPKR(product.pricePerKg)}
                    <span className="text-base font-semibold text-white/60"> /kg</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-white/60 uppercase">Min. order</p>
                  <p className="mt-1 text-2xl font-extrabold text-brand-400">{product.moq} kg</p>
                </div>
              </div>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm font-semibold text-navy">
                    <CheckCircle2 className="size-5 shrink-0 text-brand" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <p className="text-xs font-bold tracking-wider text-muted uppercase">Available pack sizes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.packSizes.map((s) => (
                    <span key={s} className="rounded-full border border-navy/10 px-3.5 py-1.5 text-sm font-semibold text-navy">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="mt-8">
              <QuantityCalculator
                slug={product.slug}
                name={product.name}
                pricePerKg={product.pricePerKg}
                moq={product.moq}
              />
            </Reveal>
          </div>
        </div>

        {/* Specs + tiers */}
        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="h-full overflow-hidden rounded-3xl border border-navy/8 bg-white">
              <h2 className="border-b border-navy/8 bg-mist px-6 py-4 text-lg font-extrabold text-navy">
                Technical specifications
              </h2>
              <dl className="divide-y divide-navy/8">
                {specs.map(([k, v]) => (
                  <div key={k} className="grid gap-1 px-6 py-3.5 text-sm sm:grid-cols-3 sm:gap-4">
                    <dt className="font-bold text-navy">{k}</dt>
                    <dd className="text-muted sm:col-span-2">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="h-full overflow-hidden rounded-3xl border border-navy/8 bg-white">
              <h2 className="border-b border-navy/8 bg-mist px-6 py-4 text-lg font-extrabold text-navy">
                Volume pricing
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs tracking-wider text-muted uppercase">
                    <th className="px-6 pt-4 pb-2 font-bold">Quantity</th>
                    <th className="px-6 pt-4 pb-2 text-right font-bold">Price / kg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/8">
                  {tiers.map((t) => (
                    <tr key={t.label}>
                      <td className="px-6 py-3.5 font-semibold text-navy">
                        {t.label}
                        {t.discount > 0 && (
                          <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
                            -{Math.round(t.discount * 100)}%
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right font-extrabold text-navy">
                        {formatPKR(product.pricePerKg * (1 - t.discount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-6 py-4 text-xs text-muted">
                Prices exclude delivery. Custom formulations and private labelling quoted separately.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="bg-mist py-20 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="You may also like" title="Related soap bases" />
            <Reveal>
              <Link href="/products" className="btn btn-outline group">
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                Back to catalogue
              </Link>
            </Reveal>
          </div>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
