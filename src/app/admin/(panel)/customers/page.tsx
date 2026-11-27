import type { Metadata } from "next";
import Link from "next/link";
import { count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { Plus, Users } from "lucide-react";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { PAGE_SIZE, pageParam, str } from "@/lib/admin-utils";
import { formatPKR } from "@/lib/utils";
import { Card, EmptyState, PageHeader, Pagination, SearchBar, Table, Td, Th, buildHref, formatDate } from "@/components/admin/ui";
import { btn } from "@/components/admin/styles";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage({ searchParams }: PageProps<"/admin/customers">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = str(sp.q).trim();
  const page = pageParam(sp.page);
  const where = q
    ? or(ilike(customers.name, `%${q}%`), ilike(customers.company, `%${q}%`), ilike(customers.phone, `%${q}%`), ilike(customers.email, `%${q}%`), ilike(customers.city, `%${q}%`))
    : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: customers.id,
        name: customers.name,
        company: customers.company,
        phone: customers.phone,
        email: customers.email,
        city: customers.city,
        createdAt: customers.createdAt,
        orderCount: sql<number>`count(${orders.id})::int`,
        spent: sql<number>`coalesce(sum(${orders.total}) filter (where ${orders.status} <> 'cancelled'), 0)::int`,
        lastOrder: sql<Date | null>`max(${orders.createdAt})`,
      })
      .from(customers)
      .leftJoin(orders, eq(orders.customerId, customers.id))
      .where(where)
      .groupBy(customers.id)
      .orderBy(desc(sql`coalesce(sum(${orders.total}), 0)`), desc(customers.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(customers).where(where),
  ]);

  return (
    <>
      <PageHeader
        title="Customers"
        description="Wholesale buyers, sorted by total spend."
        actions={<Link href="/admin/customers/new" className={btn("primary")}><Plus className="size-4" /> Add customer</Link>}
      />
      <div className="mb-4 flex justify-end">
        <SearchBar placeholder="Name, company, phone, city…" defaultValue={q} />
      </div>
      <Card>
        {rows.length === 0 ? (
          <EmptyState icon={Users} title="No customers found" action={<Link href="/admin/customers/new" className={btn("primary")}>Add customer</Link>} />
        ) : (
          <>
            <ul className="divide-y divide-navy/8 md:hidden">
              {rows.map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/customers/${c.id}`} className="block p-4 hover:bg-mist/40">
                    <div className="flex justify-between gap-2">
                      <span className="font-bold text-navy">{c.name}</span>
                      <span className="font-extrabold text-navy">{formatPKR(c.spent)}</span>
                    </div>
                    <p className="text-sm text-muted">{[c.company, c.city].filter(Boolean).join(" · ") || c.phone}</p>
                    <p className="mt-1 text-xs text-muted">{c.orderCount} orders</p>
                  </Link>
                </li>
              ))}
            </ul>
            <Table className="hidden md:block">
              <thead>
                <tr>
                  <Th>Customer</Th>
                  <Th>Contact</Th>
                  <Th className="hidden lg:table-cell">City</Th>
                  <Th className="text-right">Orders</Th>
                  <Th className="text-right">Total spent</Th>
                  <Th className="hidden xl:table-cell">Last order</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="hover:bg-mist/40">
                    <Td>
                      <Link href={`/admin/customers/${c.id}`} className="font-bold text-navy hover:text-brand">{c.name}</Link>
                      {c.company && <p className="text-xs text-muted">{c.company}</p>}
                    </Td>
                    <Td>
                      <p>{c.phone}</p>
                      {c.email && <p className="text-xs text-muted">{c.email}</p>}
                    </Td>
                    <Td className="hidden text-muted lg:table-cell">{c.city ?? "—"}</Td>
                    <Td className="text-right tabular-nums">{c.orderCount}</Td>
                    <Td className="text-right font-bold text-navy tabular-nums">{formatPKR(c.spent)}</Td>
                    <Td className="hidden text-muted xl:table-cell">{c.lastOrder ? formatDate(c.lastOrder) : "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination page={page} pageCount={Math.ceil(total / PAGE_SIZE)} hrefFor={(p) => buildHref("/admin/customers", { q, page: p })} />
          </>
        )}
      </Card>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
