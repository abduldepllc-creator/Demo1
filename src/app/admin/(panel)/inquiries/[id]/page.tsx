import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Mail, MapPin, MessageCircle, Package, Phone, ShoppingCart, UserPlus } from "lucide-react";
import { db } from "@/db";
import { INQUIRY_STATUSES, inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { deleteInquiry, inquiryToCustomer, setInquiryStatus } from "@/actions/admin/inquiries";
import { Badge, Card, PageHeader, formatDate } from "@/components/admin/ui";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { SubmitButton } from "@/components/admin/form";
import { btn } from "@/components/admin/styles";

export const metadata: Metadata = { title: "Quote request" };

export default async function InquiryDetailPage({ params }: PageProps<"/admin/inquiries/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const r = await db.query.inquiries.findFirst({ where: eq(inquiries.id, id) });
  if (!r) notFound();
  const wa = `https://wa.me/${r.phone.replace(/[^\d]/g, "").replace(/^0/, "92")}?text=${encodeURIComponent(`Hi ${r.name}, thank you for your enquiry with SoapBase Pakistan.`)}`;

  return (
    <>
      <PageHeader
        title={r.name}
        description={`Quote request #${r.id} · ${formatDate(r.createdAt, true)}`}
        back={{ href: "/admin/inquiries", label: "Quote requests" }}
        actions={
          <>
            <Link href={`/admin/orders/new?inquiry=${r.id}`} className={btn("primary")}><ShoppingCart className="size-4" /> Convert to order</Link>
            <ConfirmAction action={inquiryToCustomer.bind(null, r.id)} message="Create a customer record from this request?" label="Save as customer" variant="outline" size="md" />
            <ConfirmAction action={deleteInquiry.bind(null, r.id)} message="Delete this quote request?" size="md" />
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card title="Request">
          <div className="space-y-5 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-mist p-4">
                <p className="flex items-center gap-1.5 text-xs font-bold text-muted uppercase"><Package className="size-3.5" /> Product</p>
                <p className="mt-1 font-bold text-navy">{r.product ?? "Not specified"}</p>
              </div>
              <div className="rounded-xl bg-mist p-4">
                <p className="text-xs font-bold text-muted uppercase">Estimated quantity</p>
                <p className="mt-1 font-bold text-navy">{r.quantityKg ? `${r.quantityKg} kg` : "Not specified"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-muted uppercase">Message</p>
              <p className="mt-1 whitespace-pre-line text-ink">{r.message || "No message"}</p>
            </div>
          </div>
        </Card>
        <div className="space-y-6">
          <Card title="Contact">
            <div className="space-y-2.5 p-5 text-sm">
              {r.company && <p className="font-bold text-navy">{r.company}</p>}
              <p className="flex items-center gap-2"><Phone className="size-4 text-muted" /><a href={`tel:${r.phone}`} className="hover:text-brand">{r.phone}</a></p>
              {r.email && <p className="flex items-center gap-2 break-all"><Mail className="size-4 shrink-0 text-muted" /><a href={`mailto:${r.email}`} className="hover:text-brand">{r.email}</a></p>}
              {r.city && <p className="flex items-center gap-2"><MapPin className="size-4 text-muted" />{r.city}</p>}
              <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btn("outline")} mt-2 w-full`}>
                <MessageCircle className="size-4 text-[#25D366]" /> Reply on WhatsApp
              </a>
            </div>
          </Card>
          <Card title="Status">
            <form action={setInquiryStatus.bind(null, r.id)} className="space-y-3 p-5">
              <Badge value={r.status} />
              <select name="status" defaultValue={r.status} className="w-full rounded-xl border border-navy/12 px-3.5 py-2.5 text-sm capitalize">
                {INQUIRY_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <SubmitButton className="w-full">Update status</SubmitButton>
            </form>
          </Card>
          <p className="flex items-start gap-2 text-xs text-muted">
            <UserPlus className="mt-0.5 size-3.5 shrink-0" /> &ldquo;Convert to order&rdquo; pre-fills a new order with this contact and product, and marks the request as converted.
          </p>
        </div>
      </div>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
