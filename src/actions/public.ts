"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers, products, reviews } from "@/db/schema";
import type { FormState } from "@/types";

const reviewSchema = z.object({
  productId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2, "Please enter your name").max(80),
  company: z.string().trim().max(100).optional().transform((v) => v || null),
  city: z.string().trim().max(60).optional().transform((v) => v || null),
  rating: z.coerce.number().int().min(1, "Please choose a rating").max(5),
  title: z.string().trim().max(120).optional().transform((v) => v || null),
  comment: z.string().trim().min(10, "Please write at least 10 characters").max(1500),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

/** Public review submission: saved as "pending" until approved in the admin panel. */
export async function submitReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const { website: _hp, ...data } = parsed.data;
  void _hp;
  const product = await db.query.products.findFirst({ where: eq(products.id, data.productId), columns: { id: true, isActive: true } });
  if (!product?.isActive) return { status: "error", message: "This product is no longer available." };

  try {
    await db.insert(reviews).values({ ...data, status: "pending" });
  } catch (err) {
    console.error("Failed to save review", err);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
  return { status: "success", message: "Thank you! Your review will appear once our team approves it." };
}

const subscribeSchema = z.object({
  email: z.email("Please enter a valid email").max(200),
  website: z.string().max(0).optional(),
});

export async function subscribeNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = subscribeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0].message };
  const email = parsed.data.email.toLowerCase();
  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email, source: "website-footer" })
      .onConflictDoUpdate({ target: newsletterSubscribers.email, set: { status: "subscribed", updatedAt: new Date() } });
  } catch (err) {
    console.error("Failed to subscribe", err);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
  return { status: "success", message: "You're subscribed! Watch your inbox for offers and new products." };
}
