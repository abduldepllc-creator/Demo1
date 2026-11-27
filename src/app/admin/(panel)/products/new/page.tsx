import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { imageUploadsEnabled } from "@/config/env";
import { requireAdmin } from "@/lib/admin-session";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();
  const cats = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.sortOrder));
  return (
    <>
      <PageHeader title="Add product" back={{ href: "/admin/products", label: "Products" }} />
      <ProductForm categories={cats} storageReady={imageUploadsEnabled} />
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
