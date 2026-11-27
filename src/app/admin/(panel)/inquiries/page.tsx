import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { MessageSquareText } from "lucide-react";
import { db } from "@/db";
import { INQUIRY_STATUSES, inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { PAGE_SIZE, pageParam, str } from "@/lib/admin-utils";
import { Badge, Card, EmptyState, FilterTabs, PageHeader, Pagination, SearchBar, buildHref, formatDate } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Quote requests" };

export default async function AdminInquiriesPage({ searchParams }: PageProps<"/admin/inquiries">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = str(sp.q).trim();
  const status = str(sp.status) || "all";
  const page = pageParam(sp.page);

  const filters: SQL[] = [];
  if (q) filters.push(or(ilike(inquiries.name, `%${q}%`), ilike(inquiries.company, `%${q}%`), ilike(inquiries.phone, `%${q}%`), ilike(inquiries.product, `%${q}%`))!);
  if ((INQUIRY_STATUSES as readonly string[]).includes(status)) filters.push(eq(inquiries.status, status as (typeof INQUIRY_STATUSES)[number]));
  const where = filters.length ? and(...filters) : undefined;

  const [rows, [{ total }], counts] = await Promise.all([
    db.select().from(inquiries).where(where).orderBy(desc(inquiries.createdAt)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(inquiries).where(where),
    db.select({ status: inquiries.status, n: sql<number>`count(*)::int` }).from(inquiries).groupBy(inquiries.status),
  ]);
  const all = counts.reduce((a, x) => a + x.n, 0);
  const href = (p: Record<string, string | number | undefined>) => buildHref("/admin/inquiries", { q, status: status === "all" ? undefined : status, ...p });

  return (
    <>
      <PageHeader title="Quote requests" description="Enquiries from the website quote form. Convert them into customers and orders." />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          active={status}
          hrefFor={(v) => href({ status: v === "all" ? undefined : v, page: undefined })}
          options={[{ value: "all", label: "All", count: all }, ...INQUIRY_STATUSES.map((s) => ({ value: s, label: s, count: counts.find((c) => c.status === s)?.n ?? 0 }))]}
        />
        <SearchBar placeholder="Name, company, phone, product…" defaultValue={q} hidden={{ status: status === "all" ? undefined : status }} />
      </div>
      <Card>
        {rows.length === 0 ? (
          <EmptyState icon={MessageSquareText} title="No quote requests" text="Requests submitted on /contact appear here." />
        ) : (
          <>
            <ul className="divide-y divide-navy/8">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/inquiries/${r.id}`} className="flex flex-col gap-2 p-4 hover:bg-mist/40 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-navy">{r.name}</span>
                        {r.company && <span className="text-sm text-muted">· {r.company}</span>}
                        <Badge value={r.status} />
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted">
                        {r.product ?? "General enquiry"}{r.quantityKg ? ` · ${r.quantityKg} kg` : ""}{r.city ? ` · ${r.city}` : ""}
                      </p>
                      {r.message && <p className="mt-1 line-clamp-1 text-sm text-ink/80">{r.message}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-muted sm:flex-col sm:items-end">
                      <span>{formatDate(r.createdAt, true)}</span>
                      <span>{r.phone}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Pagination page={page} pageCount={Math.ceil(total / PAGE_SIZE)} hrefFor={(p) => href({ page: p })} />
          </>
        )}
      </Card>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
