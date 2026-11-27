import type { Metadata } from "next";
import { and, count, desc, eq, ilike, sql, type SQL } from "drizzle-orm";
import { Download, Mail, UserCheck, UserMinus } from "lucide-react";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { PAGE_SIZE, pageParam, str } from "@/lib/admin-utils";
import { deleteSubscriber, setSubscriberStatus } from "@/actions/admin/newsletter";
import { Badge, Card, EmptyState, FilterTabs, PageHeader, Pagination, SearchBar, StatCard, Table, Td, Th, buildHref, formatDate } from "@/components/admin/ui";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { SubscriberForm } from "@/components/admin/subscriber-form";
import { btn } from "@/components/admin/styles";

export const metadata: Metadata = { title: "Newsletter" };

export default async function AdminNewsletterPage({ searchParams }: PageProps<"/admin/newsletter">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = str(sp.q).trim();
  const status = str(sp.status) || "all";
  const page = pageParam(sp.page);

  const filters: SQL[] = [];
  if (q) filters.push(ilike(newsletterSubscribers.email, `%${q}%`));
  if (status === "subscribed" || status === "unsubscribed") filters.push(eq(newsletterSubscribers.status, status));
  const where = filters.length ? and(...filters) : undefined;

  const [rows, [{ total }], [stats]] = await Promise.all([
    db.select().from(newsletterSubscribers).where(where).orderBy(desc(newsletterSubscribers.createdAt)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ total: count() }).from(newsletterSubscribers).where(where),
    db
      .select({
        all: count(),
        active: sql<number>`count(*) filter (where ${newsletterSubscribers.status} = 'subscribed')::int`,
        month: sql<number>`count(*) filter (where ${newsletterSubscribers.createdAt} > now() - interval '30 days')::int`,
      })
      .from(newsletterSubscribers),
  ]);
  const href = (p: Record<string, string | number | undefined>) => buildHref("/admin/newsletter", { q, status: status === "all" ? undefined : status, ...p });

  return (
    <>
      <PageHeader
        title="Newsletter"
        description="People who subscribed from the website footer, plus any you add manually."
        actions={
          <a href="/admin/newsletter/export" className={btn("outline")}>
            <Download className="size-4" /> Export CSV
          </a>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Active subscribers" value={stats.active} icon={UserCheck} tone="green" />
        <StatCard label="New in last 30 days" value={stats.month} icon={Mail} />
        <StatCard label="Unsubscribed" value={stats.all - stats.active} icon={UserMinus} tone="amber" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <FilterTabs
              active={status}
              hrefFor={(v) => href({ status: v === "all" ? undefined : v, page: undefined })}
              options={[{ value: "all", label: "All" }, { value: "subscribed", label: "Subscribed" }, { value: "unsubscribed", label: "Unsubscribed" }]}
            />
            <SearchBar placeholder="Search email…" defaultValue={q} hidden={{ status: status === "all" ? undefined : status }} />
          </div>
          <Card>
            {rows.length === 0 ? (
              <EmptyState icon={Mail} title="No subscribers found" />
            ) : (
              <>
                <Table>
                  <thead>
                    <tr>
                      <Th>Email</Th>
                      <Th className="hidden sm:table-cell">Source</Th>
                      <Th className="hidden md:table-cell">Joined</Th>
                      <Th>Status</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((s) => (
                      <tr key={s.id} className="hover:bg-mist/40">
                        <Td>
                          <p className="font-semibold break-all text-navy">{s.email}</p>
                          {s.name && <p className="text-xs text-muted">{s.name}</p>}
                        </Td>
                        <Td className="hidden text-muted sm:table-cell">{s.source}</Td>
                        <Td className="hidden whitespace-nowrap text-muted md:table-cell">{formatDate(s.createdAt)}</Td>
                        <Td><Badge value={s.status} /></Td>
                        <Td>
                          <div className="flex justify-end gap-1.5">
                            <ConfirmAction
                              action={setSubscriberStatus.bind(null, s.id, s.status === "subscribed" ? "unsubscribed" : "subscribed")}
                              message={s.status === "subscribed" ? "Unsubscribe this email?" : "Re-subscribe this email?"}
                              label={s.status === "subscribed" ? "Unsubscribe" : "Resubscribe"}
                              variant="ghost"
                            />
                            <ConfirmAction action={deleteSubscriber.bind(null, s.id)} message={`Delete ${s.email}?`} />
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
        </div>
        <Card title="Add subscriber" className="self-start">
          <SubscriberForm />
        </Card>
      </div>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
