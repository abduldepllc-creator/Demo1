import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { imageUploadsEnabled } from "@/config/env";
import { requireAdmin } from "@/lib/admin-session";
import { PageHeader } from "@/components/admin/ui";
import { CategoryForm } from "@/components/admin/category-form";
import { btn } from "@/components/admin/styles";

export const metadata: Metadata = { title: "Edit category" };

export default async function EditCategoryPage({ params }: PageProps<"/admin/categories/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const category = await db.query.categories.findFirst({ where: eq(categories.id, id) });
  if (!category) notFound();
  return (
    <>
      <PageHeader
        title={category.name}
        back={{ href: "/admin/categories", label: "Categories" }}
        actions={
          category.isActive ? (
            <a href={`/categories/${category.slug}`} target="_blank" className={btn("outline")}>
              <ExternalLink className="size-4" /> View on site
            </a>
          ) : undefined
        }
      />
      <CategoryForm category={category} storageReady={imageUploadsEnabled} />
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
