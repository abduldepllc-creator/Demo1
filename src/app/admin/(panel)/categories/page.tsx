import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asc, count, eq } from "drizzle-orm";
import { FolderTree, Pencil, Plus } from "lucide-react";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import { deleteCategory } from "@/actions/admin/categories";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { btn } from "@/components/admin/styles";
import { SoapBlock } from "@/components/shared/soap-block";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      tagline: categories.tagline,
      color: categories.color,
      translucent: categories.translucent,
      imageUrl: categories.imageUrl,
      sortOrder: categories.sortOrder,
      isActive: categories.isActive,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.sortOrder), asc(categories.id));

  return (
    <>
      <PageHeader
        title="Categories"
        description="Soap base categories, their colours and landing-page content."
        actions={
          <Link href="/admin/categories/new" className={btn("primary")}>
            <Plus className="size-4" /> Add category
          </Link>
        }
      />
      {rows.length === 0 ? (
        <Card>
          <EmptyState icon={FolderTree} title="No categories yet" action={<Link href="/admin/categories/new" className={btn("primary")}>Add category</Link>} />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <Card key={c.id} className="flex flex-col">
              <div className="flex items-start gap-4 p-5">
                <span className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-mist">
                  {c.imageUrl ? (
                    <Image src={c.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                  ) : (
                    <SoapBlock color={c.color} translucent={c.translucent} stamp={false} shadow={false} className="w-12" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-navy">{c.name}</h2>
                    {!c.isActive && <Badge value="draft" />}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted">{c.tagline || "No tagline"}</p>
                  <p className="mt-2 text-xs text-muted">
                    /{c.slug} · Order {c.sortOrder} · <span className="font-bold text-navy">{c.productCount}</span> products
                  </p>
                </div>
              </div>
              <div className="mt-auto flex flex-wrap justify-end gap-2 border-t border-navy/8 px-5 py-3">
                <Link href={`/admin/products?category=${c.id}`} className={btn("ghost", "sm")}>View products</Link>
                <Link href={`/admin/categories/${c.id}`} className={btn("outline", "sm")}><Pencil className="size-3.5" /> Edit</Link>
                <ConfirmAction
                  action={deleteCategory.bind(null, c.id)}
                  message={c.productCount ? `"${c.name}" still has ${c.productCount} products. Move or delete them first.` : `Delete "${c.name}"?`}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
