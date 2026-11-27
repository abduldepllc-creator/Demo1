import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { Plus, ShoppingCart } from "lucide-react";
import { db } from "@/db";
import { ORDER_STATUSES, orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { PAGE_SIZE, pageParam, str } from "@/lib/admin-utils";
import { formatPKR } from "@/lib/utils";
import { Badge, Card, EmptyState, FilterTabs, PageHeader, Pagination, SearchBar, Table, Td, Th, buildHref, formatDate } from "@/components/admin/ui";
import { btn } from "@/components/admin/styles";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = str(sp.q).trim();
  const status = str(sp.status) || "all";
  const page = pageParam(sp.page);

  const filters: SQL[] = [];
  if (q) filters.push(or(ilike(orders.orderNumber, `%${q}%`), ilike(orders.customerName, `%${q}%`), ilike(orders.company, `%${q}%`), ilike(orders.phone, `%${q}%`))!);
  if ((ORDER_STATUSES as readonly string[]).includes(status)) filters.push(eq(orders.status, status as (typeof ORDER_STATUSES)[number]));
  const where = filters.length ? and(...filters) : undefined;

  const [rows, [{ total }], statusCounts] = await Promise.all([
    db.query.orders.findMany({
      where,
      with: { items: { columns: { quantityKg: true } } },
      orderBy: desc(orders.createdAt),
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    db.select({ total: count() }).from(orders).where(where),
    db.select({ status: orders.status, n: sql<number>`count(*)::int` }).from(orders).groupBy(orders.status),
  ]);
  const countFor = (s: string) => statusCounts.find((x) => x.status === s)?.n ?? 0;
  const all = statusCounts.reduce((a, x) => a + x.n, 0);
  const href = (p: Record<string, string | number | undefined>) => buildHref("/admin/orders", { q, status: status === "all" ? undefined : status, ...p });

  return (
    <>
      <PageHeader
        title="Orders"
        description="Wholesale orders. Confirming an order deducts its stock automatically."
        actions={<Link href="/admin/orders/new" className={btn("primary")}><Plus className="size-4" /> New order</Link>}
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          active={status}
          hrefFor={(v) => href({ status: v === "all" ? undefined : v, page: undefined })}
          options={[{ value: "all", label: "All", count: all }, ...ORDER_STATUSES.map((s) => ({ value: s, label: s, count: countFor(s) }))]}
        />
        <SearchBar placeholder="Order #, customer, phone…" defaultValue={q} hidden={{ status: status === "all" ? undefined : status }} />
      </div>

      <Card>
        {rows.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No orders found" action={<Link href="/admin/orders/new" className={btn("primary")}>Create order</Link>} />
        ) : (
          <>
            <ul className="divide-y divide-navy/8 md:hidden">
              {rows.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="block p-4 hover:bg-mist/40">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold text-navy">{o.orderNumber}</span>
                      <span className="font-extrabold text-navy">{formatPKR(o.total)}</span>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">{o.customerName}{o.company ? ` · ${o.company}` : ""}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Badge value={o.status} />
                      <Badge value={o.paymentStatus} />
                      <span className="text-xs text-muted">{formatDate(o.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Table className="hidden md:block">
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th className="hidden lg:table-cell">Date</Th>
                  <Th className="text-right">Qty</Th>
                  <Th className="text-right">Total</Th>
                  <Th>Status</Th>
                  <Th>Payment</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} className="hover:bg-mist/40">
                    <Td className="whitespace-nowrap"><Link href={`/admin/orders/${o.id}`} className="font-mono font-bold text-navy hover:text-brand">{o.orderNumber}</Link></Td>
                    <Td>
                      <p className="font-semibold text-navy">{o.customerName}</p>
                      <p className="text-xs text-muted">{[o.company, o.city].filter(Boolean).join(" · ")}</p>
                    </Td>
                    <Td className="hidden whitespace-nowrap text-muted lg:table-cell">{formatDate(o.createdAt)}</Td>
                    <Td className="text-right whitespace-nowrap tabular-nums">{o.items.reduce((a, i) => a + i.quantityKg, 0)} kg</Td>
                    <Td className="text-right font-bold whitespace-nowrap text-navy tabular-nums">{formatPKR(o.total)}</Td>
                    <Td><Badge value={o.status} /></Td>
                    <Td><Badge value={o.paymentStatus} /></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination page={page} pageCount={Math.ceil(total / PAGE_SIZE)} hrefFor={(p) => href({ page: p })} />
          </>
        )}
      </Card>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
