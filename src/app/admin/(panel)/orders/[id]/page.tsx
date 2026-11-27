import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Mail, MapPin, Pencil, Phone, User } from "lucide-react";
import { db } from "@/db";
import { ORDER_STATUSES, PAYMENT_STATUSES, orders, stockMovements } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { DEDUCTING_STATUSES } from "@/lib/stock";
import { formatPKR } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { deleteOrder, updateOrderStatus } from "@/actions/admin/orders";
import { Badge, Card, PageHeader, Table, Td, Th, formatDate } from "@/components/admin/ui";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { SubmitButton } from "@/components/admin/form";
import { PrintButton } from "@/components/admin/print-button";
import { btn } from "@/components/admin/styles";

export const metadata: Metadata = { title: "Order" };

export default async function OrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id), with: { items: true, customer: { columns: { id: true } } } });
  if (!order) notFound();
  const movements = await db.query.stockMovements.findMany({
    where: eq(stockMovements.orderId, id),
    with: { product: { columns: { name: true } } },
    orderBy: desc(stockMovements.createdAt),
  });

  return (
    <>
      <div className="print:hidden">
        <PageHeader
          title={<span className="font-mono">{order.orderNumber}</span>}
          description={`Created ${formatDate(order.createdAt, true)} · updated ${formatDate(order.updatedAt, true)}`}
          back={{ href: "/admin/orders", label: "Orders" }}
          actions={
            <>
              <PrintButton />
              <Link href={`/admin/orders/${order.id}/edit`} className={btn("outline")}><Pencil className="size-4" /> Edit</Link>
              <ConfirmAction action={deleteOrder.bind(null, order.id)} message="Delete this order? Any deducted stock will be returned." size="md" />
            </>
          }
        />
      </div>

      {/* Printable invoice header */}
      <div className="mb-6 hidden print:block">
        <p className="text-2xl font-extrabold text-navy">{siteConfig.name}</p>
        <p className="text-sm">{siteConfig.contact.address} · {siteConfig.contact.phone} · {siteConfig.contact.email}</p>
        <p className="mt-4 text-xl font-bold">Invoice {order.orderNumber}</p>
        <p className="text-sm">Date: {formatDate(order.createdAt)}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card title="Items">
            <Table>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th className="text-right">Qty</Th>
                  <Th className="text-right">Unit price</Th>
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((i) => (
                  <tr key={i.id}>
                    <Td>
                      {i.productId ? (
                        <Link href={`/admin/products/${i.productId}`} className="font-semibold text-navy hover:text-brand print:no-underline">{i.productName}</Link>
                      ) : (
                        <span className="font-semibold text-navy">{i.productName}</span>
                      )}
                      <p className="text-xs text-muted">{i.sku}</p>
                    </Td>
                    <Td className="text-right whitespace-nowrap tabular-nums">{i.quantityKg} kg</Td>
                    <Td className="text-right whitespace-nowrap tabular-nums">{formatPKR(i.unitPrice)}</Td>
                    <Td className="text-right font-bold whitespace-nowrap tabular-nums">{formatPKR(i.lineTotal)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <dl className="ml-auto max-w-xs space-y-1.5 p-5 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-semibold tabular-nums">{formatPKR(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between"><dt className="text-muted">Discount</dt><dd className="font-semibold text-brand-700 tabular-nums">−{formatPKR(order.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd className="font-semibold tabular-nums">{order.deliveryFee ? formatPKR(order.deliveryFee) : "Free"}</dd></div>
              <div className="flex justify-between border-t border-navy/10 pt-2 text-base"><dt className="font-bold text-navy">Total</dt><dd className="font-extrabold text-navy tabular-nums">{formatPKR(order.total)}</dd></div>
            </dl>
          </Card>

          {order.notes && (
            <Card title="Notes">
              <p className="p-5 text-sm whitespace-pre-line text-muted">{order.notes}</p>
            </Card>
          )}

          {movements.length > 0 && (
            <Card title="Stock movements" className="print:hidden">
              <ul className="divide-y divide-navy/8 text-sm">
                {movements.map((m) => (
                  <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                    <span><span className="font-semibold text-navy">{m.product.name}</span> <span className="text-muted">· {m.reason}</span></span>
                    <span className={`font-bold tabular-nums ${m.quantityKg < 0 ? "text-red-600" : "text-brand-700"}`}>{m.quantityKg > 0 ? "+" : ""}{m.quantityKg} kg</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Status" className="print:hidden">
            <form action={updateOrderStatus.bind(null, order.id)} className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                <Badge value={order.status} />
                <Badge value={order.paymentStatus} />
                {order.stockDeducted && <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs font-semibold text-muted">Stock deducted</span>}
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-navy">Order status</span>
                <select name="status" defaultValue={order.status} className="w-full rounded-xl border border-navy/12 px-3.5 py-2.5 text-sm">
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}{DEDUCTING_STATUSES.includes(s) ? " (stock out)" : ""}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-navy">Payment</span>
                <select name="paymentStatus" defaultValue={order.paymentStatus} className="w-full rounded-xl border border-navy/12 px-3.5 py-2.5 text-sm">
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </label>
              <SubmitButton className="w-full">Update status</SubmitButton>
            </form>
          </Card>

          <Card title="Customer">
            <div className="space-y-2.5 p-5 text-sm">
              <p className="flex items-center gap-2 font-bold text-navy">
                <User className="size-4 text-muted" />
                {order.customer ? <Link href={`/admin/customers/${order.customer.id}`} className="hover:text-brand">{order.customerName}</Link> : order.customerName}
              </p>
              {order.company && <p className="pl-6 text-muted">{order.company}</p>}
              <p className="flex items-center gap-2"><Phone className="size-4 text-muted" /><a href={`tel:${order.phone}`} className="hover:text-brand">{order.phone}</a></p>
              {order.email && <p className="flex items-center gap-2 break-all"><Mail className="size-4 shrink-0 text-muted" /><a href={`mailto:${order.email}`} className="hover:text-brand">{order.email}</a></p>}
              {(order.address || order.city) && <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-muted" />{[order.address, order.city].filter(Boolean).join(", ")}</p>}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
