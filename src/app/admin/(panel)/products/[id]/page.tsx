import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { storageConfigured } from "@/config/env";
import { requireAdmin } from "@/lib/admin-session";
import { deleteProduct } from "@/actions/admin/products";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { btn } from "@/components/admin/styles";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [product, cats] = await Promise.all([
    db.query.products.findFirst({ where: eq(products.id, id) }),
    db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.sortOrder)),
  ]);
  if (!product) notFound();

  return (
    <>
      <PageHeader
        title={product.name}
        description={`SKU ${product.sku}`}
        back={{ href: "/admin/products", label: "Products" }}
        actions={
          <>
            {product.isActive && (
              <a href={`/products/${product.slug}`} target="_blank" className={btn("outline")}>
                <ExternalLink className="size-4" /> View on site
              </a>
            )}
            <ConfirmAction action={deleteProduct.bind(null, product.id)} message={`Delete "${product.name}"?`} size="md" />
          </>
        }
      />
      <ProductForm product={product} categories={cats} storageReady={storageConfigured} />
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
