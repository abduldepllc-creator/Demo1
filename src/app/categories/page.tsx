import type { Metadata } from "next";
import { getCategoriesWithCounts } from "@/db/queries/catalog";
import { PageHero } from "@/components/shared/page-hero";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { CategoryCard } from "@/components/home/category-card";
import { CtaBand } from "@/components/home/cta-band";
import { SoapBlock } from "@/components/shared/soap-block";

export const metadata: Metadata = {
  title: "Soap Base Categories",
  description:
    "Explore our six premium melt & pour soap base categories: transparent, milky, goat milk, aloe vera, shea butter and activated charcoal. Bulk supply across Pakistan.",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <>
      <PageHero
        eyebrow="Shop by base"
        title={
          <>
            Six bases, <span className="text-gradient">one trusted source</span>
          </>
        }
        description="Every SoapBase category is made for a specific look, feel and customer. Pick the one that fits your products, or mix several in a single bulk order."
        crumbs={[{ label: "Categories" }]}
        aside={
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="animate-float absolute top-[8%] left-[4%] w-[58%]">
              <SoapBlock color="#cfeef5" translucent />
            </div>
            <div className="animate-float-slow absolute top-[38%] right-0 w-[52%] [animation-delay:1s]">
              <SoapBlock color="#f2dcaa" />
            </div>
            <div className="animate-float absolute bottom-[2%] left-[14%] w-[46%] [animation-delay:2s]">
              <SoapBlock color="#2e3338" />
            </div>
          </div>
        }
      />

      <section className="container-x pb-20 sm:pb-28">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {categories.map((c) => (
            <StaggerItem key={c.slug}>
              <CategoryCard {...c} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaBand />
    </>
  );
}
