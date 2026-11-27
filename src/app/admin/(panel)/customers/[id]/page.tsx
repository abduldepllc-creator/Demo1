import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { formatPKR } from "@/lib/utils";
import { deleteCustomer } from "@/actions/admin/customers";
import { Badge, Card, EmptyState, PageHeader, StatCard, Table, Td, Th, formatDate } from "@/components/admin/ui";
import { CustomerForm } from "@/components/admin/customer-form";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { btn } from "@/components/admin/styles";
import { CalendarDays, ShoppingCart, Wallet } from "lucide-react";

export const metadata: Metadata = { title: "Customer" };

export default async function CustomerDetailPage({ params }: PageProps<"/admin/customers/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const customer = await db.query.customers.findFirst({ where: eq(customers.id, id) });
  if (!customer) notFound();
  const history = await db.select().from(orders).where(eq(orders.customerId, id)).orderBy(desc(orders.createdAt));
  const spent = history.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.total, 0);

  return (
    <>
      <PageHeader
        title={customer.name}
        description={[customer.company, customer.city].filter(Boolean).join(" · ") || undefined}
        back={{ href: "/admin/customers", label: "Customers" }}
        actions={
          <>
            <Link href="/admin/orders/new" className={btn("primary")}><Plus className="size-4" /> New order</Link>
            <ConfirmAction action={deleteCustomer.bind(null, customer.id)} message="Delete this customer? Their orders are kept." size="md" />
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total spent" value={formatPKR(spent)} icon={Wallet} tone="green" />
        <StatCard label="Orders" value={history.length} icon={ShoppingCart} />
        <StatCard label="Customer since" value={formatDate(customer.createdAt)} icon={CalendarDays} tone="amber" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card title="Order history">
          {history.length === 0 ? (
            <EmptyState title="No orders yet" />
          ) : (
            <Table>
              <thead>
                <tr><Th>Order</Th><Th>Date</Th><Th className="text-right">Total</Th><Th>Status</Th></tr>
              </thead>
              <tbody>
                {history.map((o) => (
                  <tr key={o.id} className="hover:bg-mist/40">
                    <Td><Link href={`/admin/orders/${o.id}`} className="font-mono font-bold text-navy hover:text-brand">{o.orderNumber}</Link></Td>
                    <Td className="whitespace-nowrap text-muted">{formatDate(o.createdAt)}</Td>
                    <Td className="text-right font-bold whitespace-nowrap tabular-nums">{formatPKR(o.total)}</Td>
                    <Td><Badge value={o.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
        <CustomerForm customer={customer} />
      </div>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
