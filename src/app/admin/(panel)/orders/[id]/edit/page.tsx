import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { getOrderFormOptions } from "@/lib/admin-queries";
import { PageHeader } from "@/components/admin/ui";
import { OrderForm } from "@/components/admin/order-form";

export const metadata: Metadata = { title: "Edit order" };

export default async function EditOrderPage({ params }: PageProps<"/admin/orders/[id]/edit">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [order, options] = await Promise.all([
    db.query.orders.findFirst({ where: eq(orders.id, id), with: { items: true } }),
    getOrderFormOptions(),
  ]);
  if (!order) notFound();
  return (
    <>
      <PageHeader
        title={<>Edit <span className="font-mono">{order.orderNumber}</span></>}
        description="Saving re-calculates totals and re-applies stock for the selected status."
        back={{ href: `/admin/orders/${order.id}`, label: "Back to order" }}
      />
      <OrderForm order={order} customers={options.customers} products={options.products} />
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
