"use server";

import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { categories, products, type CategoryBenefit } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { checkbox, fieldErrors, jsonStrings, optionalText, redirectWithToast, refreshCatalog, slugify, uniqueViolation } from "@/lib/admin-utils";
import { deleteImages } from "@/lib/storage";
import type { ActionState } from "@/components/admin/form";

const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  slug: z.string().trim().max(80).optional(),
  tagline: z.string().trim().max(140).optional().default(""),
  description: z.string().trim().max(1000).optional().default(""),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour like #cfeef5"),
  translucent: checkbox,
  imageUrl: optionalText,
  headline: z.string().trim().max(160).optional().default(""),
  proTip: z.string().trim().max(500).optional().default(""),
  sortOrder: z.coerce.number().int().default(0),
  isActive: checkbox,
});

function parseBenefits(value: FormDataEntryValue | null): CategoryBenefit[] {
  try {
    const arr = JSON.parse(String(value ?? "[]"));
    return Array.isArray(arr)
      ? arr
          .map((b) => ({ title: String(b?.title ?? "").trim(), text: String(b?.text ?? "").trim() }))
          .filter((b) => b.title)
      : [];
  } catch {
    return [];
  }
}

export async function saveCategory(id: number | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrors(parsed.error);

  const { slug, ...data } = parsed.data;
  const values = {
    ...data,
    slug: slugify(slug || data.name),
    benefits: parseBenefits(formData.get("benefits")),
    applications: jsonStrings(formData.get("applications")),
  };

  let oldImage: string | null = null;
  try {
    if (id) {
      const existing = await db.query.categories.findFirst({ where: eq(categories.id, id), columns: { imageUrl: true } });
      if (!existing) return { error: "Category not found." };
      oldImage = existing.imageUrl !== values.imageUrl ? existing.imageUrl : null;
      await db.update(categories).set(values).where(eq(categories.id, id));
    } else {
      await db.insert(categories).values(values);
    }
  } catch (err) {
    const msg = uniqueViolation(err);
    if (msg) return { error: msg };
    console.error("saveCategory failed", err);
    return { error: "Could not save the category. Please try again." };
  }

  if (oldImage) await deleteImages([oldImage]);
  refreshCatalog();
  redirectWithToast("/admin/categories", id ? "Category updated" : "Category created");
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  const [{ n }] = await db.select({ n: count() }).from(products).where(eq(products.categoryId, id));
  if (n > 0) redirectWithToast("/admin/categories", `Cannot delete: ${n} product${n === 1 ? "" : "s"} still use this category`);
  const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning({ imageUrl: categories.imageUrl });
  if (deleted?.imageUrl) await deleteImages([deleted.imageUrl]);
  refreshCatalog();
  redirectWithToast("/admin/categories", "Category deleted");
}
