import type { Metadata } from "next";
import { storageConfigured } from "@/config/env";
import { requireAdmin } from "@/lib/admin-session";
import { PageHeader } from "@/components/admin/ui";
import { CategoryForm } from "@/components/admin/category-form";

export const metadata: Metadata = { title: "New category" };

export default async function NewCategoryPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add category" back={{ href: "/admin/categories", label: "Categories" }} />
      <CategoryForm storageReady={storageConfigured} />
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
