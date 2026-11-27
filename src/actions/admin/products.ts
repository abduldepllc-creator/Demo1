"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { products, stockMovements } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import {
  checkbox,
  fieldErrors,
  jsonStrings,
  optionalText,
  redirectWithToast,
  refreshCatalog,
  slugify,
  uniqueViolation,
} from "@/lib/admin-utils";
import { deleteImages } from "@/lib/storage";
import type { ActionState } from "@/components/admin/form";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #cfeef5");

const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(140),
  slug: z.string().trim().max(90).optional(),
  sku: z.string().trim().min(2, "SKU is required").max(40),
  categoryId: z.coerce.number().int().positive("Choose a category"),
  shortDescription: z.string().trim().min(5, "Add a short description").max(220),
  description: z.string().trim().min(10, "Add a full description").max(5000),
  pricePerKg: z.coerce.number().int("Whole rupees only").min(1, "Price must be at least Rs 1"),
  moq: z.coerce.number().int().min(1, "MOQ must be at least 1 kg"),
  ingredients: z.string().trim().max(1000).optional().default(""),
  phLevel: z.string().trim().max(40).optional().default(""),
  meltPoint: z.string().trim().max(40).optional().default(""),
  shelfLife: z.string().trim().max(40).optional().default(""),
  color: z.union([hex, z.literal("")]).optional().transform((v) => v || null),
  badge: optionalText,
  lowStockThreshold: z.coerce.number().int().min(0).default(100),
  openingStock: z.coerce.number().int().min(0).optional(),
  featured: checkbox,
  isActive: checkbox,
});

export async function saveProduct(id: number | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrors(parsed.error);

  const { openingStock, slug, ...data } = parsed.data;
  const values = {
    ...data,
    slug: slugify(slug || data.name),
    sku: data.sku.toUpperCase(),
    images: jsonStrings(formData.get("images")),
    packSizes: jsonStrings(formData.get("packSizes")),
    features: jsonStrings(formData.get("features")),
  };
  if (!values.slug) return { error: "Please enter a valid name or slug." };

  let removedImages: string[] = [];
  try {
    if (id) {
      const existing = await db.query.products.findFirst({ where: eq(products.id, id), columns: { images: true } });
      if (!existing) return { error: "Product not found." };
      removedImages = existing.images.filter((u) => !values.images.includes(u));
      await db.update(products).set(values).where(eq(products.id, id));
    } else {
      await db.transaction(async (tx) => {
        const stock = openingStock ?? 0;
        const [created] = await tx.insert(products).values({ ...values, stockKg: stock }).returning({ id: products.id });
        if (stock > 0) {
          await tx.insert(stockMovements).values({ productId: created.id, type: "in", quantityKg: stock, balanceKg: stock, reason: "Opening stock" });
        }
      });
    }
  } catch (err) {
    const msg = uniqueViolation(err);
    if (msg) return { error: msg };
    console.error("saveProduct failed", err);
    return { error: "Could not save the product. Please try again." };
  }

  await deleteImages(removedImages);
  refreshCatalog();
  redirectWithToast("/admin/products", id ? "Product updated" : "Product created");
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning({ images: products.images });
  if (deleted) await deleteImages(deleted.images);
  refreshCatalog();
  redirectWithToast("/admin/products", "Product deleted");
}

export async function setProductFlag(id: number, flag: "isActive" | "featured", value: boolean) {
  await requireAdmin();
  await db.update(products).set({ [flag]: value }).where(eq(products.id, id));
  refreshCatalog();
  redirectWithToast("/admin/products", flag === "isActive" ? (value ? "Product published" : "Product hidden from website") : value ? "Marked as featured" : "Removed from featured");
}
