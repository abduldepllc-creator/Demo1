"use client";

import { AnimatePresence, motion } from "motion/react";
import { PackageSearch, Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Category, ProductWithCategory } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A – Z" },
];

export function Catalog({ products, categories }: { products: ProductWithCategory[]; categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramCategory = searchParams.get("category") ?? "all";
  const active = categories.some((c) => c.slug === paramCategory) ? paramCategory : "all";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("featured");

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (active === "all" || p.category.slug === active) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))),
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.pricePerKg - b.pricePerKg);
    if (sort === "price-desc") sorted.sort((a, b) => b.pricePerKg - a.pricePerKg);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [products, active, query, sort]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) map.set(p.category.slug, (map.get(p.category.slug) ?? 0) + 1);
    return map;
  }, [products]);

  const chips = [{ slug: "all", name: "All Products", count: products.length }].concat(
    categories.map((c) => ({ slug: c.slug, name: c.name.replace(" Soap Base", ""), count: counts.get(c.slug) ?? 0 })),
  );

  return (
    <div className="container-x pb-20 sm:pb-28">
      {/* Toolbar */}
      <div className="sticky top-17.5 z-30 -mx-4 border-b border-navy/5 bg-white/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {chips.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategory(c.slug)}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors",
                  active === c.slug ? "text-white" : "bg-mist text-navy hover:bg-navy-50",
                )}
              >
                {active === c.slug && (
                  <motion.span
                    layoutId="chip-bg"
                    className="absolute inset-0 rounded-full bg-navy"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {c.name}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px]",
                      active === c.slug ? "bg-brand text-white" : "bg-white text-muted",
                    )}
                  >
                    {c.count}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <label className="relative flex-1 lg:w-64 lg:flex-none">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search soap bases…"
                className="input rounded-full! py-2.5! pl-10!"
              />
            </label>
            <label className="relative">
              <span className="sr-only">Sort by</span>
              <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="input w-auto! cursor-pointer appearance-none rounded-full! py-2.5! pr-4! pl-10! text-sm font-semibold"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm text-muted">
        <p>
          Showing <span className="font-bold text-navy">{results.length}</span> of {products.length} products
        </p>
        {(active !== "all" || query) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="flex items-center gap-1 font-semibold text-brand hover:text-brand-700"
          >
            <X className="size-4" /> Clear filters
          </button>
        )}
      </div>

      <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        <AnimatePresence mode="popLayout">
          {results.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex flex-col items-center rounded-3xl bg-mist px-6 py-16 text-center"
        >
          <PackageSearch className="size-12 text-muted" />
          <h3 className="mt-4 text-lg font-extrabold text-navy">No products match your search</h3>
          <p className="mt-1 text-sm text-muted">Try a different keyword or category — or ask us for a custom base.</p>
        </motion.div>
      )}
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="container-x pb-20">
      <div className="flex gap-2 py-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-9 w-28 rounded-full" />
        ))}
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-105 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
