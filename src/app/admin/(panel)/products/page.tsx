import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { and, asc, count, desc, eq, ilike, lte, or, sql, type SQL } from "drizzle-orm";
import { Eye, Package, Pencil, Plus, Star } from "lucide-react";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { PAGE_SIZE, pageParam, str } from "@/lib/admin-utils";
import { formatPKR } from "@/lib/utils";
import { deleteProduct, setProductFlag } from "@/actions/admin/products";
import { Badge, Card, EmptyState, FilterTabs, PageHeader, Pagination, SearchBar, Table, Td, Th, buildHref, stockStatus } from "@/components/admin/ui";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { btn } from "@/components/admin/styles";
import { SoapBlock } from "@/components/shared/soap-block";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = str(sp.q).trim();
  const status = str(sp.status) || "all";
  const cat = Number(str(sp.category)) || 0;
  const page = pageParam(sp.page);

  const filters: SQL[] = [];
  if (q) filters.push(or(ilike(products.name, `%${q}%`), ilike(products.sku, `%${q}%`))!);
  if (cat) filters.push(eq(products.categoryId, cat));
  if (status === "published") filters.push(eq(products.isActive, true));
  if (status === "hidden") filters.push(eq(products.isActive, false));
  if (status === "featured") filters.push(eq(products.featured, true));
  if (status === "low") filters.push(lte(products.stockKg, products.lowStockThreshold));
  const where = filters.length ? and(...filters) : undefined;

  const [rows, [{ total }], cats, counts] = await Promise.all([
    db.query.products.findMany({
      where,
      with: { category: { columns: { name: true, color: true, translucent: true } } },
      orderBy: [desc(products.updatedAt), asc(products.id)],
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    db.select({ total: count() }).from(products).where(where),
    db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.sortOrder)),
    db
      .select({
        all: count(),
        published: sql<number>`count(*) filter (where ${products.isActive})::int`,
        hidden: sql<number>`count(*) filter (where not ${products.isActive})::int`,
        featured: sql<number>`count(*) filter (where ${products.featured})::int`,
        low: sql<number>`count(*) filter (where ${products.stockKg} <= ${products.lowStockThreshold})::int`,
      })
      .from(products),
  ]);
  const c = counts[0];
  const href = (p: Record<string, string | number | undefined>) => buildHref("/admin/products", { q, status: status === "all" ? undefined : status, category: cat || undefined, ...p });

  return (
    <>
      <PageHeader
        title="Products"
        description="Everything here appears on the public website: names, prices, images, specs and stock badges."
        actions={
          <Link href="/admin/products/new" className={btn("primary")}>
            <Plus className="size-4" /> Add product
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          active={status}
          hrefFor={(v) => href({ status: v === "all" ? undefined : v, page: undefined })}
          options={[
            { value: "all", label: "All", count: c.all },
            { value: "published", label: "Published", count: c.published },
            { value: "hidden", label: "Hidden", count: c.hidden },
            { value: "featured", label: "Featured", count: c.featured },
            { value: "low", label: "Low stock", count: c.low },
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <form method="get" className="flex gap-2">
            {q && <input type="hidden" name="q" value={q} />}
            {status !== "all" && <input type="hidden" name="status" value={status} />}
            <select name="category" defaultValue={cat || ""} className="rounded-xl border border-navy/12 bg-white px-3 py-2.5 text-sm">
              <option value="">All categories</option>
              {cats.map((x) => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))}
            </select>
            <button className={btn("outline")}>Filter</button>
          </form>
          <SearchBar placeholder="Search name or SKU…" defaultValue={q} hidden={{ status: status === "all" ? undefined : status, category: cat ? String(cat) : undefined }} />
        </div>
      </div>

      <Card>
        {rows.length === 0 ? (
          <EmptyState icon={Package} title="No products found" text="Try a different search or filter, or add a new product." action={<Link href="/admin/products/new" className={btn("primary")}>Add product</Link>} />
        ) : (
          <>
            {/* Mobile cards */}
            <ul className="divide-y divide-navy/8 md:hidden">
              {rows.map((p) => (
                <li key={p.id} className="flex items-center gap-3 p-4">
                  <Thumb p={p} />
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/products/${p.id}`} className="block truncate font-bold text-navy">{p.name}</Link>
                    <p className="text-xs text-muted">{p.sku} · {p.category.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-extrabold text-navy">{formatPKR(p.pricePerKg)}/kg</span>
                      <Badge value={stockStatus(p.stockKg, p.lowStockThreshold)} />
                      {!p.isActive && <Badge value="draft" />}
                    </div>
                  </div>
                  <Link href={`/admin/products/${p.id}`} className={btn("outline", "sm")} aria-label={`Edit ${p.name}`}>
                    <Pencil className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop table */}
            <Table className="hidden md:block">
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>Category</Th>
                  <Th className="text-right">Price/kg</Th>
                  <Th className="text-right">Stock</Th>
                  <Th>Rating</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-mist/40">
                    <Td>
                      <div className="flex items-center gap-3">
                        <Thumb p={p} />
                        <div className="min-w-0">
                          <Link href={`/admin/products/${p.id}`} className="font-bold text-navy hover:text-brand">{p.name}</Link>
                          <p className="text-xs text-muted">
                            {p.sku} {p.featured && <span className="ml-1 font-semibold text-amber-600">★ Featured</span>}
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-muted">{p.category.name}</Td>
                    <Td className="text-right font-bold text-navy tabular-nums">{formatPKR(p.pricePerKg)}</Td>
                    <Td className="text-right">
                      <span className="font-semibold tabular-nums">{p.stockKg} kg</span>
                      <div className="mt-0.5"><Badge value={stockStatus(p.stockKg, p.lowStockThreshold)} /></div>
                    </Td>
                    <Td>
                      {p.reviewCount ? (
                        <span className="flex items-center gap-1 text-sm"><Star className="size-3.5 fill-amber-400 text-amber-400" />{p.rating.toFixed(1)} <span className="text-muted">({p.reviewCount})</span></span>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </Td>
                    <Td><Badge value={p.isActive ? "active" : "draft"} /></Td>
                    <Td>
                      <div className="flex justify-end gap-1.5">
                        <ConfirmAction
                          action={setProductFlag.bind(null, p.id, "isActive", !p.isActive)}
                          message={p.isActive ? "Hide this product from the website?" : "Publish this product on the website?"}
                          label={p.isActive ? "Hide" : "Publish"}
                          variant="ghost"
                        />
                        {p.isActive && (
                          <a href={`/products/${p.slug}`} target="_blank" className={btn("ghost", "sm")} aria-label="View on website"><Eye className="size-3.5" /></a>
                        )}
                        <Link href={`/admin/products/${p.id}`} className={btn("outline", "sm")}><Pencil className="size-3.5" /> Edit</Link>
                        <ConfirmAction action={deleteProduct.bind(null, p.id)} message={`Delete "${p.name}"? Its reviews and stock history will also be deleted.`} />
                      </div>
                    </Td>
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

function Thumb({ p }: { p: { images: string[]; name: string; color: string | null; category: { color: string; translucent: boolean } } }) {
  return (
    <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-mist">
      {p.images[0] ? (
        <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" />
      ) : (
        <SoapBlock color={p.color ?? p.category.color} translucent={p.category.translucent} stamp={false} shadow={false} className="w-9" />
      )}
    </span>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
