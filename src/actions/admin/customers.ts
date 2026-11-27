"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { fieldErrors, optionalText, redirectWithToast } from "@/lib/admin-utils";
import type { ActionState } from "@/components/admin/form";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  company: optionalText,
  email: z.union([z.literal(""), z.email("Invalid email")]).optional().transform((v) => v || null),
  phone: z.string().trim().min(7, "Phone is required").max(30),
  city: optionalText,
  address: optionalText,
  notes: optionalText,
});

export async function saveCustomer(id: number | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrors(parsed.error);
  let newId = id;
  try {
    if (id) await db.update(customers).set(parsed.data).where(eq(customers.id, id));
    else newId = (await db.insert(customers).values(parsed.data).returning({ id: customers.id }))[0].id;
  } catch (err) {
    console.error("saveCustomer failed", err);
    return { error: "Could not save the customer. Please try again." };
  }
  redirectWithToast(`/admin/customers/${newId}`, id ? "Customer updated" : "Customer added");
}

export async function deleteCustomer(id: number) {
  await requireAdmin();
  // Orders keep their customer snapshot (customer_id is set to NULL).
  await db.delete(customers).where(eq(customers.id, id));
  redirectWithToast("/admin/customers", "Customer deleted");
}
