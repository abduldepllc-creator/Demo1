import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { categories, products, reviews, type ProductWithCategory } from "@/db/schema";

/*
 * Public (customer-side) catalogue queries.
 * Cached with the "catalog" tag. Admin mutations call updateTag("catalog")
 * so changes appear on the website immediately.
 * Only published products in published categories are returned.
 */

const isVisible = (p: ProductWithCategory) => p.isActive && p.category.isActive;

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder), asc(categories.id));
}

export async function getCategoriesWithCounts() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  const rows = await db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: [asc(categories.sortOrder), asc(categories.id)],
    with: { products: { columns: { id: true, pricePerKg: true }, where: eq(products.isActive, true) } },
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
  const rows = await db.query.products.findMany({
    with: { category: true },
    orderBy: [asc(products.categoryId), desc(products.featured), asc(products.id)],
  });
  return rows.filter(isVisible);
}

export async function getFeaturedProducts(): Promise<ProductWithCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  const rows = await db.query.products.findMany({
    where: and(eq(products.featured, true), eq(products.isActive, true)),
    with: { category: true },
    orderBy: [asc(products.categoryId), asc(products.id)],
  });
  return rows.filter(isVisible);
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  const product = await db.query.products.findFirst({ where: eq(products.slug, slug), with: { category: true } });
  return product && isVisible(product) ? product : null;
}

export async function getCategoryBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  const category = await db.query.categories.findFirst({
    where: and(eq(categories.slug, slug), eq(categories.isActive, true)),
    with: {
      products: {
        where: eq(products.isActive, true),
        with: { category: true },
        orderBy: [desc(products.featured), asc(products.id)],
      },
    },
  });
  return category ?? null;
}

export async function getRelatedProducts(categoryId: number, excludeId: number): Promise<ProductWithCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  const all = (await db.query.products.findMany({ with: { category: true } })).filter(isVisible);
  const same = all.filter((p) => p.categoryId === categoryId && p.id !== excludeId);
  const others = all.filter((p) => p.categoryId !== categoryId && p.featured);
  return [...same, ...others].slice(0, 4);
}

export async function getApprovedReviews(productId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");
  return db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.status, "approved")))
    .orderBy(desc(reviews.createdAt))
    .limit(20);
}
