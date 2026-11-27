import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, gte, lte, ne, sql } from "drizzle-orm";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Mail,
  MessageSquareText,
  Package,
  Plus,
  ShoppingCart,
  Star,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { db } from "@/db";
import { inquiries, newsletterSubscribers, orderItems, orders, products, reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { formatPKR } from "@/lib/utils";
import { Badge, Card, PageHeader, StatCard, formatDate } from "@/components/admin/ui";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { btn } from "@/components/admin/styles";

export const metadata: Metadata = { title: "Overview" };

const PKT = "Asia/Karachi";

export default async function AdminOverviewPage() {
  await requireAdmin();
  const notCancelled = ne(orders.status, "cancelled");

  const [monthly, [counts], recentOrders, lowStock, recentInquiries, topProducts] = await Promise.all([
    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${orders.createdAt} at time zone ${PKT}), 'YYYY-MM')`,
        revenue: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
        orders: sql<number>`count(*)::int`,
      })
      .from(orders)
      .where(and(notCancelled, gte(orders.createdAt, sql`date_trunc('month', now() at time zone ${PKT}) - interval '5 months'`)))
      .groupBy(sql`1`),
    db
      .select({
        pendingOrders: sql<number>`(select count(*)::int from ${orders} where ${orders.status} in ('pending','confirmed','processing'))`,
        unpaid: sql<number>`(select coalesce(sum(${orders.total}),0)::int from ${orders} where ${orders.paymentStatus} in ('unpaid','partial') and ${orders.status} <> 'cancelled')`,
        activeProducts: sql<number>`(select count(*)::int from ${products} where ${products.isActive})`,
        lowStock: sql<number>`(select count(*)::int from ${products} where ${products.stockKg} <= ${products.lowStockThreshold})`,
        newInquiries: sql<number>`(select count(*)::int from ${inquiries} where ${inquiries.status} = 'new')`,
        pendingReviews: sql<number>`(select count(*)::int from ${reviews} where ${reviews.status} = 'pending')`,
        subscribers: sql<number>`(select count(*)::int from ${newsletterSubscribers} where ${newsletterSubscribers.status} = 'subscribed')`,
      })
      .from(sql`(select 1) as one`),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
    db
      .select({ id: products.id, name: products.name, stockKg: products.stockKg, threshold: products.lowStockThreshold })
      .from(products)
      .where(lte(products.stockKg, products.lowStockThreshold))
      .orderBy(products.stockKg)
      .limit(6),
    db.select().from(inquiries).where(eq(inquiries.status, "new")).orderBy(desc(inquiries.createdAt)).limit(5),
    db
      .select({ name: orderItems.productName, kg: sql<number>`sum(${orderItems.quantityKg})::int`, revenue: sql<number>`sum(${orderItems.lineTotal})::int` })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .where(notCancelled)
      .groupBy(orderItems.productName)
      .orderBy(desc(sql`sum(${orderItems.lineTotal})`))
      .limit(5),
  ]);

  // Build a continuous 6-month series (months with no orders show as 0)
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: PKT }));
  const series = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const row = monthly.find((m) => m.month === key);
    return { key, label: d.toLocaleDateString("en-GB", { month: "short" }), revenue: row?.revenue ?? 0, orders: row?.orders ?? 0 };
  });
  const thisMonth = series[5];
  const lastMonth = series[4];
  const change = lastMonth.revenue ? ((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100 : null;
  const sixMonthRevenue = series.reduce((a, s) => a + s.revenue, 0);
  const sixMonthOrders = series.reduce((a, s) => a + s.orders, 0);
  const maxTop = Math.max(1, ...topProducts.map((t) => t.revenue));

  return (
    <>
      <PageHeader
        title="Overview"
        description={`Today is ${now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
        actions={
          <>
            <Link href="/admin/orders/new" className={btn("primary")}><Plus className="size-4" /> New order</Link>
            <Link href="/admin/products/new" className={btn("outline")}><Plus className="size-4" /> Add product</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue this month"
          value={formatPKR(thisMonth.revenue)}
          hint={
            change === null ? "No sales last month" : (
              <span className={`inline-flex items-center gap-1 font-semibold ${change >= 0 ? "text-brand-700" : "text-red-600"}`}>
                {change >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                {Math.abs(change).toFixed(0)}% vs last month
              </span>
            )
          }
          icon={Wallet}
          tone="green"
        />
        <StatCard label="Orders this month" value={thisMonth.orders} hint={`${counts.pendingOrders} open orders in progress`} icon={ShoppingCart} href="/admin/orders" />
        <StatCard label="Awaiting payment" value={formatPKR(counts.unpaid)} hint="Unpaid & partially paid orders" icon={Clock} tone="amber" href="/admin/orders" />
        <StatCard label="Low / out of stock" value={counts.lowStock} hint={`${counts.activeProducts} products published`} icon={AlertTriangle} tone={counts.lowStock ? "red" : "navy"} href="/admin/stock?filter=low" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Revenue, last 6 months" actions={<span className="text-xs text-muted">{formatPKR(sixMonthRevenue)} · {sixMonthOrders} orders · excl. cancelled</span>}>
          <div className="p-4 sm:p-5">
            <RevenueChart data={series.map(({ label, revenue, orders: n }) => ({ label, revenue, orders: n }))} />
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <StatCard label="New quote requests" value={counts.newInquiries} icon={MessageSquareText} href="/admin/inquiries?status=new" />
          <StatCard label="Reviews to approve" value={counts.pendingReviews} icon={Star} tone="amber" href="/admin/reviews" />
          <StatCard label="Newsletter subscribers" value={counts.subscribers} icon={Mail} tone="green" href="/admin/newsletter" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Recent orders" actions={<Link href="/admin/orders" className="flex items-center gap-1 text-sm font-semibold text-brand">All orders <ArrowRight className="size-3.5" /></Link>}>
          <ul className="divide-y divide-navy/8">
            {recentOrders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-mist/40">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-navy">{o.customerName}</p>
                    <p className="text-xs text-muted"><span className="font-mono">{o.orderNumber}</span> · {formatDate(o.createdAt)}</p>
                  </div>
                  <Badge value={o.status} className="hidden sm:inline-flex" />
                  <span className="text-sm font-extrabold whitespace-nowrap text-navy tabular-nums">{formatPKR(o.total)}</span>
                </Link>
              </li>
            ))}
            {recentOrders.length === 0 && <li className="px-5 py-6 text-sm text-muted">No orders yet.</li>}
          </ul>
        </Card>

        <Card title="Top products by revenue">
          <ul className="space-y-4 p-5">
            {topProducts.map((t) => (
              <li key={t.name}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-semibold text-navy">{t.name}</span>
                  <span className="shrink-0 font-bold text-navy tabular-nums">{formatPKR(t.revenue)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-mist">
                    <span className="block h-full rounded-full bg-brand" style={{ width: `${(t.revenue / maxTop) * 100}%` }} />
                  </span>
                  <span className="w-16 text-right text-xs text-muted tabular-nums">{t.kg.toLocaleString()} kg</span>
                </div>
              </li>
            ))}
            {topProducts.length === 0 && <li className="text-sm text-muted">No sales yet.</li>}
          </ul>
        </Card>

        <Card title="Stock alerts" actions={<Link href="/admin/stock" className="flex items-center gap-1 text-sm font-semibold text-brand">Manage stock <ArrowRight className="size-3.5" /></Link>}>
          <ul className="divide-y divide-navy/8">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <Package className="size-4 shrink-0 text-muted" />
                <Link href={`/admin/stock?product=${p.id}`} className="min-w-0 flex-1 truncate text-sm font-semibold text-navy hover:text-brand">{p.name}</Link>
                <Badge value={p.stockKg <= 0 ? "out of stock" : "low stock"} />
                <span className="w-16 text-right text-sm font-bold tabular-nums">{p.stockKg} kg</span>
              </li>
            ))}
            {lowStock.length === 0 && <li className="px-5 py-6 text-sm text-muted">All products are above their alert level.</li>}
          </ul>
        </Card>

        <Card title="New quote requests" actions={<Link href="/admin/inquiries" className="flex items-center gap-1 text-sm font-semibold text-brand">All requests <ArrowRight className="size-3.5" /></Link>}>
          <ul className="divide-y divide-navy/8">
            {recentInquiries.map((q) => (
              <li key={q.id}>
                <Link href={`/admin/inquiries/${q.id}`} className="block px-5 py-3 hover:bg-mist/40">
                  <p className="text-sm font-bold text-navy">{q.name}{q.company ? ` · ${q.company}` : ""}</p>
                  <p className="truncate text-xs text-muted">{q.product ?? "General enquiry"}{q.quantityKg ? ` · ${q.quantityKg} kg` : ""} · {formatDate(q.createdAt)}</p>
                </Link>
              </li>
            ))}
            {recentInquiries.length === 0 && <li className="px-5 py-6 text-sm text-muted">No new requests. You&apos;re all caught up.</li>}
          </ul>
        </Card>
      </div>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
