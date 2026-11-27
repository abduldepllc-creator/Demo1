"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { REVIEW_STATUSES, reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { fieldErrors, optionalText, redirectWithToast, refreshCatalog, syncProductRating } from "@/lib/admin-utils";
import type { ActionState } from "@/components/admin/form";

const schema = z.object({
  productId: z.coerce.number().int().positive("Choose a product"),
  name: z.string().trim().min(2, "Name is required").max(80),
  company: optionalText,
  city: optionalText,
  rating: z.coerce.number().int().min(1).max(5),
  title: optionalText,
  comment: z.string().trim().min(5, "Write a comment").max(2000),
  status: z.enum(REVIEW_STATUSES),
});

export async function saveReview(id: number | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrors(parsed.error);
  let previousProduct: number | null = null;
  try {
    if (id) {
      const existing = await db.query.reviews.findFirst({ where: eq(reviews.id, id), columns: { productId: true } });
      previousProduct = existing?.productId ?? null;
      await db.update(reviews).set(parsed.data).where(eq(reviews.id, id));
    } else {
      await db.insert(reviews).values(parsed.data);
    }
    await syncProductRating(db, parsed.data.productId);
    if (previousProduct && previousProduct !== parsed.data.productId) await syncProductRating(db, previousProduct);
  } catch (err) {
    console.error("saveReview failed", err);
    return { error: "Could not save the review. Please try again." };
  }
  refreshCatalog();
  redirectWithToast("/admin/reviews", id ? "Review updated" : "Review added");
}

export async function setReviewStatus(id: number, status: (typeof REVIEW_STATUSES)[number]) {
  await requireAdmin();
  const [r] = await db.update(reviews).set({ status }).where(eq(reviews.id, id)).returning({ productId: reviews.productId });
  if (r) await syncProductRating(db, r.productId);
  refreshCatalog();
  redirectWithToast("/admin/reviews", `Review ${status}`);
}

export async function deleteReview(id: number) {
  await requireAdmin();
  const [r] = await db.delete(reviews).where(eq(reviews.id, id)).returning({ productId: reviews.productId });
  if (r) await syncProductRating(db, r.productId);
  refreshCatalog();
  redirectWithToast("/admin/reviews", "Review deleted");
}
