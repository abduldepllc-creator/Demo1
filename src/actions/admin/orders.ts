"use server";

import { and, eq, inArray, like, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  customers,
  inquiries,
  orderItems,
  orders,
  products,
} from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { fieldErrors, optionalText, redirectWithToast, refreshCatalog } from "@/lib/admin-utils";
import { syncOrderStock } from "@/lib/stock";
import type { ActionState } from "@/components/admin/form";

const itemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantityKg: z.coerce.number().int().min(1),
  unitPrice: z.coerce.number().int().min(0),
});

const orderSchema = z.object({
  customerId: z.coerce.number().int().optional().transform((v) => (v && v > 0 ? v : null)),
  customerName: z.string().trim().min(2, "Customer name is required").max(120),
  company: optionalText,
  phone: z.string().trim().min(7, "Phone is required").max(30),
  email: z.union([z.literal(""), z.email("Invalid email")]).optional().transform((v) => v || null),
  city: optionalText,
  address: optionalText,
  status: z.enum(ORDER_STATUSES),
  paymentStatus: z.enum(PAYMENT_STATUSES),
  discount: z.coerce.number().int().min(0).default(0),
  deliveryFee: z.coerce.number().int().min(0).default(0),
  notes: optionalText,
  inquiryId: z.coerce.number().int().optional().transform((v) => (v && v > 0 ? v : null)),
  saveCustomer: z.string().optional(),
});

function parseItems(value: FormDataEntryValue | null) {
  try {
    const raw = JSON.parse(String(value ?? "[]"));
    const parsed = z.array(itemSchema).safeParse(raw);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

async function nextOrderNumber() {
  const year = new Date().getFullYear();
  const prefix = `SB-${year}-`;
  const [row] = await db
    .select({ max: sql<string | null>`max(${orders.orderNumber})` })
    .from(orders)
    .where(like(orders.orderNumber, `${prefix}%`));
  const last = row?.max ? Number(row.max.slice(prefix.length)) || 0 : 0;
  return `${prefix}${String(last + 1).padStart(4, "0")}`;
}

export async function saveOrder(id: number | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = orderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fieldErrors(parsed.error);
  const items = parseItems(formData.get("items"));
  if (!items || items.length === 0) return { error: "Add at least one product to the order." };

  const { saveCustomer, inquiryId, ...data } = parsed.data;

  // Resolve product snapshots (name, SKU) from the database.
  const ids = [...new Set(items.map((i) => i.productId))];
  const prods = await db.select({ id: products.id, name: products.name, sku: products.sku, stockKg: products.stockKg }).from(products).where(inArray(products.id, ids));
  const byId = new Map(prods.map((p) => [p.id, p]));
  if (prods.length !== ids.length) return { error: "One of the selected products no longer exists." };

  const lines = items.map((i) => {
    const p = byId.get(i.productId)!;
    return { productId: p.id, productName: p.name, sku: p.sku, quantityKg: i.quantityKg, unitPrice: i.unitPrice, lineTotal: i.quantityKg * i.unitPrice };
  });
  const subtotal = lines.reduce((a, l) => a + l.lineTotal, 0);
  const total = Math.max(0, subtotal - data.discount + data.deliveryFee);

  let orderId = id;
  try {
    await db.transaction(async (tx) => {
      // Optionally create / link a customer record
      let customerId = data.customerId;
      if (!customerId && saveCustomer === "on") {
        const [c] = await tx
          .insert(customers)
          .values({ name: data.customerName, company: data.company, phone: data.phone, email: data.email, city: data.city, address: data.address })
          .returning({ id: customers.id });
        customerId = c.id;
      }

      if (id) {
        const existing = await tx.query.orders.findFirst({ where: eq(orders.id, id), with: { items: true } });
        if (!existing) throw new UserError("Order not found.");
        // Return stock first if it was deducted, so item changes are applied cleanly.
        if (existing.stockDeducted) await syncOrderStock(tx, id, "pending");
        await tx
          .update(orders)
          .set({ ...data, customerId, subtotal, total })
          .where(eq(orders.id, id));
        await tx.delete(orderItems).where(eq(orderItems.orderId, id));
        await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: id })));
      } else {
        const orderNumber = await nextOrderNumber();
        const [created] = await tx
          .insert(orders)
          .values({ ...data, customerId, orderNumber, subtotal, total, inquiryId })
          .returning({ id: orders.id });
        orderId = created.id;
        await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: created.id })));
        if (inquiryId) await tx.update(inquiries).set({ status: "converted" }).where(eq(inquiries.id, inquiryId));
      }
      await syncOrderStock(tx, orderId!, data.status);
    });
  } catch (err) {
    if (err instanceof UserError) return { error: err.message };
    console.error("saveOrder failed", err);
    return { error: "Could not save the order. Please try again." };
  }

  refreshCatalog();
  redirectWithToast(`/admin/orders/${orderId}`, id ? "Order updated" : "Order created");
}

class UserError extends Error {}

export async function updateOrderStatus(id: number, formData: FormData) {
  await requireAdmin();
  const status = z.enum(ORDER_STATUSES).safeParse(formData.get("status"));
  const payment = z.enum(PAYMENT_STATUSES).safeParse(formData.get("paymentStatus"));
  await db.transaction(async (tx) => {
    if (status.success) {
      await syncOrderStock(tx, id, status.data);
      await tx.update(orders).set({ status: status.data }).where(eq(orders.id, id));
    }
    if (payment.success) await tx.update(orders).set({ paymentStatus: payment.data }).where(eq(orders.id, id));
  });
  refreshCatalog();
  redirectWithToast(`/admin/orders/${id}`, "Order status updated");
}

export async function deleteOrder(id: number) {
  await requireAdmin();
  await db.transaction(async (tx) => {
    await syncOrderStock(tx, id, "cancelled"); // return any deducted stock
    await tx.delete(orders).where(and(eq(orders.id, id)));
  });
  refreshCatalog();
  redirectWithToast("/admin/orders", "Order deleted (stock restored)");
}
