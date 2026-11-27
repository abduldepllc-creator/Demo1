import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { Check, Pencil, Plus, Star, X } from "lucide-react";
import { db } from "@/db";
import { REVIEW_STATUSES, reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { PAGE_SIZE, pageParam, str } from "@/lib/admin-utils";
import { deleteReview, setReviewStatus } from "@/actions/admin/reviews";
import { Badge, Card, EmptyState, FilterTabs, PageHeader, Pagination, SearchBar, buildHref, formatDate } from "@/components/admin/ui";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { btn } from "@/components/admin/styles";

export const metadata: Metadata = { title: "Reviews" };

export default async function AdminReviewsPage({ searchParams }: PageProps<"/admin/reviews">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = str(sp.q).trim();
  const status = str(sp.status) || "pending";
  const page = pageParam(sp.page);

  const filters: SQL[] = [];
  if (q) filters.push(or(ilike(reviews.name, `%${q}%`), ilike(reviews.comment, `%${q}%`), ilike(reviews.title, `%${q}%`))!);
  if ((REVIEW_STATUSES as readonly string[]).includes(status)) filters.push(eq(reviews.status, status as (typeof REVIEW_STATUSES)[number]));
  const where = filters.length ? and(...filters) : undefined;

  const [rows, [{ total }], counts] = await Promise.all([
    db.query.reviews.findMany({
      where,
      with: { product: { columns: { name: true, slug: true } } },
      orderBy: desc(reviews.createdAt),
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    db.select({ total: count() }).from(reviews).where(where),
    db.select({ status: reviews.status, n: sql<number>`count(*)::int` }).from(reviews).groupBy(reviews.status),
  ]);
  const all = counts.reduce((a, x) => a + x.n, 0);
  const href = (p: Record<string, string | number | undefined>) => buildHref("/admin/reviews", { q, status, ...p });

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Approve customer reviews before they appear on product pages. Ratings update automatically."
        actions={<Link href="/admin/reviews/new" className={btn("primary")}><Plus className="size-4" /> Add review</Link>}
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          active={status}
          hrefFor={(v) => href({ status: v, page: undefined })}
          options={[...REVIEW_STATUSES.map((s) => ({ value: s, label: s, count: counts.find((c) => c.status === s)?.n ?? 0 })), { value: "all", label: "All", count: all }]}
        />
        <SearchBar placeholder="Search reviews…" defaultValue={q} hidden={{ status }} />
      </div>
      <Card>
        {rows.length === 0 ? (
          <EmptyState icon={Star} title={status === "pending" ? "No reviews waiting for approval" : "No reviews found"} />
        ) : (
          <>
            <ul className="divide-y divide-navy/8">
              {rows.map((r) => (
                <li key={r.id} className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-4 ${i < r.rating ? "fill-current" : "text-navy/15"}`} />
                          ))}
                        </span>
                        <Badge value={r.status} />
                        <span className="text-xs text-muted">{formatDate(r.createdAt, true)}</span>
                      </div>
                      {r.title && <p className="mt-2 font-bold text-navy">{r.title}</p>}
                      <p className="mt-1 text-sm text-ink/80">{r.comment}</p>
                      <p className="mt-2 text-xs text-muted">
                        <span className="font-semibold text-navy">{r.name}</span>
                        {[r.company, r.city].filter(Boolean).length ? ` · ${[r.company, r.city].filter(Boolean).join(", ")}` : ""} · on{" "}
                        <a href={`/products/${r.product.slug}`} target="_blank" className="font-semibold text-brand hover:underline">{r.product.name}</a>
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-1.5">
                      {r.status !== "approved" && (
                        <ConfirmAction action={setReviewStatus.bind(null, r.id, "approved")} message="Approve and publish this review?" label="Approve" variant="primary" />
                      )}
                      {r.status !== "rejected" && (
                        <ConfirmAction action={setReviewStatus.bind(null, r.id, "rejected")} message="Reject this review? It will be hidden from the website." label="Reject" variant="outline" />
                      )}
                      <Link href={`/admin/reviews/${r.id}`} className={btn("ghost", "sm")}><Pencil className="size-3.5" /> Edit</Link>
                      <ConfirmAction action={deleteReview.bind(null, r.id)} message="Delete this review permanently?" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination page={page} pageCount={Math.ceil(total / PAGE_SIZE)} hrefFor={(p) => href({ page: p })} />
          </>
        )}
      </Card>
      <p className="mt-3 flex items-center gap-3 text-xs text-muted">
        <Check className="size-3.5 text-brand" /> Approved: visible on the product page
        <X className="size-3.5 text-red-500" /> Rejected / pending: hidden
      </p>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
