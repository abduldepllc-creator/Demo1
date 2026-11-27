import { asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories, products, type ProductWithCategory } from "@/db/schema";

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoriesWithCounts() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  const rows = await db.query.categories.findMany({
    orderBy: asc(categories.sortOrder),
    with: { products: { columns: { id: true, pricePerKg: true } } },
  });
  return rows.map(({ products: items, ...c }) => ({
    ...c,
    productCount: items.length,
    fromPrice: items.length ? Math.min(...items.map((p) => p.pricePerKg)) : null,
  }));
}

export async function getProducts(): Promise<ProductWithCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  return db.query.products.findMany({
    with: { category: true },
    orderBy: [asc(products.categoryId), desc(products.featured), asc(products.id)],
  });
}

export async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  return db.query.products.findMany({
    where: eq(products.featured, true),
    with: { category: true },
    orderBy: asc(products.categoryId),
  });
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: { category: true },
  });
  return product ?? null;
}

export async function getCategoryBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: { products: { with: { category: true }, orderBy: [desc(products.featured), asc(products.id)] } },
  });
  return category ?? null;
}

export async function getRelatedProducts(
  categoryId: number,
  excludeId: number,
): Promise<ProductWithCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  const all = await db.query.products.findMany({ with: { category: true } });
  const same = all.filter((p) => p.categoryId === categoryId && p.id !== excludeId);
  const others = all.filter((p) => p.categoryId !== categoryId && p.featured);
  return [...same, ...others].slice(0, 4);
}
