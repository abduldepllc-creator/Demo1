"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { fieldErrors, redirectWithToast, refreshCatalog } from "@/lib/admin-utils";
import { moveStock } from "@/lib/stock";
import type { ActionState } from "@/components/admin/form";

const schema = z.object({
  productId: z.coerce.number().int().positive("Choose a product"),
  type: z.enum(["in", "out", "adjustment"]),
  quantityKg: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  reason: z.string().trim().max(200).optional().default(""),
});

/**
 * in → add stock, out → remove stock, adjustment → set the exact counted stock level.
 */
export async function adjustStock(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrors(parsed.error);
  const { productId, type, quantityKg, reason } = parsed.data;

  const product = await db.query.products.findFirst({ where: eq(products.id, productId), columns: { stockKg: true, name: true } });
  if (!product) return { error: "Product not found." };

  let delta = 0;
  if (type === "in") delta = quantityKg;
  if (type === "out") delta = -quantityKg;
  if (type === "adjustment") delta = quantityKg - product.stockKg;

  if (type !== "adjustment" && quantityKg === 0) return { fieldErrors: { quantityKg: ["Enter a quantity greater than 0"] }, error: "Please fix the highlighted fields." };
  if (product.stockKg + delta < 0) return { error: `Only ${product.stockKg} kg of ${product.name} in stock. You can't remove ${quantityKg} kg.` };
  if (delta === 0) return { error: "Stock is already at that level. Nothing to change." };

  const defaultReason = { in: "Stock received", out: "Stock removed", adjustment: "Stock count adjustment" }[type];
  await db.transaction((tx) => moveStock(tx, productId, delta, type, reason || defaultReason));

  refreshCatalog();
  redirectWithToast("/admin/stock", `${product.name}: stock ${delta > 0 ? "+" : ""}${delta} kg`);
}

export async function setLowStockThreshold(productId: number, formData: FormData) {
  await requireAdmin();
  const value = Math.max(0, Math.floor(Number(formData.get("threshold")) || 0));
  await db.update(products).set({ lowStockThreshold: value }).where(eq(products.id, productId));
  redirectWithToast("/admin/stock", "Low-stock alert level updated");
}
