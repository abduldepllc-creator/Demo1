"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { INQUIRY_STATUSES, customers, inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { redirectWithToast } from "@/lib/admin-utils";

export async function setInquiryStatus(id: number, formData: FormData) {
  await requireAdmin();
  const status = z.enum(INQUIRY_STATUSES).safeParse(formData.get("status"));
  if (status.success) await db.update(inquiries).set({ status: status.data }).where(eq(inquiries.id, id));
  redirectWithToast(`/admin/inquiries/${id}`, "Status updated");
}

/** Save the enquirer as a customer record. */
export async function inquiryToCustomer(id: number) {
  await requireAdmin();
  const q = await db.query.inquiries.findFirst({ where: eq(inquiries.id, id) });
  if (!q) redirectWithToast("/admin/inquiries", "Quote request not found");
  const [c] = await db
    .insert(customers)
    .values({ name: q.name, company: q.company, phone: q.phone, email: q.email, city: q.city, notes: `From quote request #${q.id}` })
    .returning({ id: customers.id });
  if (q.status === "new") await db.update(inquiries).set({ status: "contacted" }).where(eq(inquiries.id, id));
  redirectWithToast(`/admin/customers/${c.id}`, "Customer created from quote request");
}

export async function deleteInquiry(id: number) {
  await requireAdmin();
  await db.delete(inquiries).where(eq(inquiries.id, id));
  redirectWithToast("/admin/inquiries", "Quote request deleted");
}
