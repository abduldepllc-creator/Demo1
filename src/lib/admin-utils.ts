import "server-only";
import { eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { DB } from "@/db";
import { products, reviews } from "@/db/schema";

/** Refresh public catalogue pages (products, categories, reviews, stock badges). */
export function refreshCatalog() {
  updateTag("catalog");
}

/** Redirect back with a toast message (shown by <Toast /> in the admin layout). */
export function redirectWithToast(path: string, message: string): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}toast=${encodeURIComponent(message)}`);
}

export function fieldErrors(error: z.ZodError) {
  return { error: "Please fix the highlighted fields.", fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[] | undefined> };
}

/** Parse a JSON array of strings from a hidden form field. */
export function jsonStrings(value: FormDataEntryValue | null): string[] {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    return Array.isArray(parsed) ? parsed.map((v) => String(v).trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null));

export const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal("")])
  .optional()
  .transform((v) => v === "on" || v === "true");

/** Postgres unique-violation → friendly message. */
export function uniqueViolation(err: unknown): string | null {
  const e = err as { code?: string; constraint_name?: string; cause?: { code?: string; constraint_name?: string } };
  const code = e?.code ?? e?.cause?.code;
  if (code !== "23505") return null;
  const c = e?.constraint_name ?? e?.cause?.constraint_name ?? "";
  if (c.includes("slug")) return "That URL slug is already used. Choose another.";
  if (c.includes("sku")) return "That SKU is already used by another product.";
  if (c.includes("email")) return "That email is already in the list.";
  return "A record with the same unique value already exists.";
}

/** Recalculate a product's average rating & review count from approved reviews. */
export async function syncProductRating(db: DB, productId: number) {
  await db
    .update(products)
    .set({
      rating: sql`COALESCE((SELECT ROUND(AVG(${reviews.rating})::numeric, 1) FROM ${reviews} WHERE ${reviews.productId} = ${productId} AND ${reviews.status} = 'approved'), 0)`,
      reviewCount: sql`(SELECT COUNT(*)::int FROM ${reviews} WHERE ${reviews.productId} = ${productId} AND ${reviews.status} = 'approved')`,
    })
    .where(eq(products.id, productId));
}

export function pageParam(v: string | string[] | undefined) {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export function str(v: string | string[] | undefined) {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

export const PAGE_SIZE = 20;
