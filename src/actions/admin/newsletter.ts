"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { fieldErrors, optionalText, redirectWithToast, uniqueViolation } from "@/lib/admin-utils";
import type { ActionState } from "@/components/admin/form";

const schema = z.object({
  email: z.email("Enter a valid email").max(200),
  name: optionalText,
});

export async function addSubscriber(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrors(parsed.error);
  try {
    await db.insert(newsletterSubscribers).values({ ...parsed.data, email: parsed.data.email.toLowerCase(), source: "admin" });
  } catch (err) {
    return { error: uniqueViolation(err) ?? "Could not add subscriber." };
  }
  redirectWithToast("/admin/newsletter", "Subscriber added");
}

export async function setSubscriberStatus(id: number, status: "subscribed" | "unsubscribed") {
  await requireAdmin();
  await db.update(newsletterSubscribers).set({ status }).where(eq(newsletterSubscribers.id, id));
  redirectWithToast("/admin/newsletter", status === "subscribed" ? "Re-subscribed" : "Unsubscribed");
}

export async function deleteSubscriber(id: number) {
  await requireAdmin();
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
  redirectWithToast("/admin/newsletter", "Subscriber deleted");
}
