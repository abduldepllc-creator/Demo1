import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/db/queries/catalog";
import { PageHero } from "@/components/shared/page-hero";
import { Catalog, CatalogSkeleton } from "@/components/products/catalog";
import { CtaBand } from "@/components/home/cta-band";

export const metadata: Metadata = {
  title: "Wholesale Soap Base Products",
  description:
    "Browse our full range of bulk melt & pour soap bases — transparent, milky, goat milk, aloe vera, shea butter and activated charcoal. Wholesale prices per kg.",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <PageHero
        title={
          <>
            Wholesale <span className="text-gradient">Soap Base</span> Catalogue
          </>
        }
        description="Premium melt & pour bases in bulk. Transparent per-kg wholesale pricing, volume discounts and fast nationwide dispatch."
        crumbs={[{ label: "Products" }]}
      />
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog products={products} categories={categories} />
      </Suspense>
      <CtaBand />
    </>
  );
}
