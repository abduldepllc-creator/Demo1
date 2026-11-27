import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { PageHeader } from "@/components/admin/ui";
import { AdminReviewForm } from "@/components/admin/review-form";

export const metadata: Metadata = { title: "New review" };

export default async function NewReviewPage() {
  await requireAdmin();
  const prods = await db.select({ id: products.id, name: products.name }).from(products).orderBy(asc(products.name));
  return (
    <>
      <PageHeader title="Add review" description="Add a review you received by phone, email or WhatsApp." back={{ href: "/admin/reviews", label: "Reviews" }} />
      <AdminReviewForm products={prods} />
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
