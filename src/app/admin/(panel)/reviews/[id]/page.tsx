import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { PageHeader } from "@/components/admin/ui";
import { AdminReviewForm } from "@/components/admin/review-form";

export const metadata: Metadata = { title: "Edit review" };

export default async function EditReviewPage({ params }: PageProps<"/admin/reviews/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [review, prods] = await Promise.all([
    db.query.reviews.findFirst({ where: eq(reviews.id, id) }),
    db.select({ id: products.id, name: products.name }).from(products).orderBy(asc(products.name)),
  ]);
  if (!review) notFound();
  return (
    <>
      <PageHeader title="Edit review" back={{ href: "/admin/reviews", label: "Reviews" }} />
      <AdminReviewForm review={review} products={prods} />
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
