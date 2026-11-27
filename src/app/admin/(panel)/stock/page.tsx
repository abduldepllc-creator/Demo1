import type { Metadata } from "next";
import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { AlertTriangle, PackageX, Scale, Warehouse } from "lucide-react";
import { db } from "@/db";
import { products, stockMovements } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { str } from "@/lib/admin-utils";
import { formatPKR } from "@/lib/utils";
import { setLowStockThreshold } from "@/actions/admin/stock";
import { Badge, Card, FilterTabs, PageHeader, StatCard, Table, Td, Th, buildHref, formatDate, stockStatus } from "@/components/admin/ui";
import { StockAdjustForm } from "@/components/admin/stock-adjust-form";

export const metadata: Metadata = { title: "Stock" };

export default async function AdminStockPage({ searchParams }: PageProps<"/admin/stock">) {
  await requireAdmin();
  const sp = await searchParams;
  const filter = str(sp.filter) || "all";
  const productParam = Number(str(sp.product)) || undefined;

  const [all, movements] = await Promise.all([
    db
      .select({ id: products.id, name: products.name, sku: products.sku, stockKg: products.stockKg, lowStockThreshold: products.lowStockThreshold, pricePerKg: products.pricePerKg, isActive: products.isActive })
      .from(products)
      .orderBy(asc(products.stockKg)),
    db.query.stockMovements.findMany({
      where: productParam ? eq(stockMovements.productId, productParam) : undefined,
      with: { product: { columns: { name: true } }, order: { columns: { id: true, orderNumber: true } } },
      orderBy: desc(stockMovements.createdAt),
      limit: 30,
    }),
  ]);

  const out = all.filter((p) => p.stockKg <= 0);
  const low = all.filter((p) => p.stockKg > 0 && p.stockKg <= p.lowStockThreshold);
  const totalKg = all.reduce((a, p) => a + Math.max(0, p.stockKg), 0);
  const value = all.reduce((a, p) => a + Math.max(0, p.stockKg) * p.pricePerKg, 0);
  const rows = filter === "low" ? low : filter === "out" ? out : all;
  const focus = productParam ? all.find((p) => p.id === productParam) : undefined;

  return (
    <>
      <PageHeader title="Stock" description="Stock levels drive the In stock / Made to order badges on the website." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total stock" value={`${totalKg.toLocaleString()} kg`} icon={Warehouse} />
        <StatCard label="Stock value (list price)" value={formatPKR(value)} icon={Scale} tone="green" />
        <StatCard label="Low stock" value={low.length} hint="At or below the alert level" icon={AlertTriangle} tone="amber" href="/admin/stock?filter=low" />
        <StatCard label="Out of stock" value={out.length} icon={PackageX} tone="red" href="/admin/stock?filter=out" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card
            title="Stock levels"
            actions={
              <FilterTabs
                active={filter}
                hrefFor={(v) => buildHref("/admin/stock", { filter: v === "all" ? undefined : v })}
                options={[{ value: "all", label: "All", count: all.length }, { value: "low", label: "Low", count: low.length }, { value: "out", label: "Out", count: out.length }]}
              />
            }
          >
            <Table>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th className="text-right">On hand</Th>
                  <Th>Status</Th>
                  <Th className="hidden md:table-cell">Alert at (kg)</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-mist/40">
                    <Td>
                      <Link href={buildHref("/admin/stock", { product: p.id, filter: filter === "all" ? undefined : filter })} className="font-semibold text-navy hover:text-brand">{p.name}</Link>
                      <p className="text-xs text-muted">{p.sku}{!p.isActive && " · hidden"}</p>
                    </Td>
                    <Td className={`text-right font-extrabold whitespace-nowrap tabular-nums ${p.stockKg < 0 ? "text-red-600" : "text-navy"}`}>{p.stockKg} kg</Td>
                    <Td><Badge value={stockStatus(p.stockKg, p.lowStockThreshold)} /></Td>
                    <Td className="hidden md:table-cell">
                      <form action={setLowStockThreshold.bind(null, p.id)} className="flex items-center gap-1.5">
                        <input name="threshold" type="number" min={0} defaultValue={p.lowStockThreshold} aria-label={`Low stock alert for ${p.name}`} className="w-20 rounded-lg border border-navy/12 px-2 py-1 text-sm" />
                        <button className="rounded-lg px-2 py-1 text-xs font-bold text-brand hover:bg-brand-50">Save</button>
                      </form>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {all.some((p) => p.stockKg < 0) && (
              <p className="border-t border-navy/8 px-5 py-3 text-xs text-muted">Negative stock means confirmed orders exceed what is on hand (backordered).</p>
            )}
          </Card>

          <Card
            title={focus ? `Movement history · ${focus.name}` : "Recent movements"}
            actions={focus ? <Link href="/admin/stock" className="text-sm font-semibold text-brand">Show all</Link> : undefined}
          >
            {movements.length === 0 ? (
              <p className="p-5 text-sm text-muted">No stock movements yet.</p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>Date</Th>
                    <Th>Product</Th>
                    <Th>Type</Th>
                    <Th className="text-right">Change</Th>
                    <Th className="text-right">Balance</Th>
                    <Th className="hidden lg:table-cell">Reason</Th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((m) => (
                    <tr key={m.id}>
                      <Td className="whitespace-nowrap text-muted">{formatDate(m.createdAt, true)}</Td>
                      <Td className="font-semibold text-navy">{m.product.name}</Td>
                      <Td><Badge value={m.type} /></Td>
                      <Td className={`text-right font-bold whitespace-nowrap tabular-nums ${m.quantityKg < 0 ? "text-red-600" : "text-brand-700"}`}>{m.quantityKg > 0 ? "+" : ""}{m.quantityKg} kg</Td>
                      <Td className="text-right whitespace-nowrap tabular-nums">{m.balanceKg} kg</Td>
                      <Td className="hidden text-muted lg:table-cell">
                        {m.order ? <Link href={`/admin/orders/${m.order.id}`} className="font-semibold text-brand">{m.reason}</Link> : m.reason}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </div>

        <Card title="Adjust stock" className="self-start xl:sticky xl:top-24">
          <StockAdjustForm key={productParam ?? 0} products={all.map(({ id, name, sku, stockKg }) => ({ id, name, sku, stockKg }))} defaultProductId={productParam} />
        </Card>
      </div>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
