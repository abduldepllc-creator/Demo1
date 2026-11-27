import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { getOrderFormOptions } from "@/lib/admin-queries";
import { priceFor } from "@/lib/pricing";
import { str } from "@/lib/admin-utils";
import { PageHeader } from "@/components/admin/ui";
import { OrderForm } from "@/components/admin/order-form";

export const metadata: Metadata = { title: "New order" };

export default async function NewOrderPage({ searchParams }: PageProps<"/admin/orders/new">) {
  await requireAdmin();
  const sp = await searchParams;
  const inquiryId = Number(str(sp.inquiry)) || 0;
  const { customers, products } = await getOrderFormOptions();

  // Pre-fill from a quote request ("Convert to order")
  let prefill: Parameters<typeof OrderForm>[0]["prefill"];
  if (inquiryId) {
    const q = await db.query.inquiries.findFirst({ where: eq(inquiries.id, inquiryId) });
    if (q) {
      const match = products.find((p) => p.name === q.product);
      const qty = Math.max(q.quantityKg ?? match?.moq ?? 25, match?.moq ?? 1);
      prefill = {
        inquiryId: q.id,
        customerName: q.name,
        company: q.company,
        phone: q.phone,
        email: q.email,
        city: q.city,
        notes: q.message ? `From quote request #${q.id}: ${q.message}` : `From quote request #${q.id}`,
        items: match ? [{ productId: match.id, quantityKg: qty, unitPrice: Math.round(priceFor(match.pricePerKg, qty, match.moq).unit) }] : [],
      };
    }
  }

  return (
    <>
      <PageHeader
        title="New order"
        description={prefill ? `Converting quote request #${inquiryId}` : undefined}
        back={{ href: "/admin/orders", label: "Orders" }}
      />
      <OrderForm customers={customers} products={products} prefill={prefill} />
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
