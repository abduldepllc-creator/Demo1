"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProduct } from "@/actions/admin/products";
import type { Category, Product } from "@/db/schema";
import { Card } from "./ui";
import { Field, FormError, Input, Select, SubmitButton, Textarea, Toggle, type ActionState } from "./form";
import { btn } from "./styles";
import { ImageUploader } from "./image-uploader";
import { ListEditor } from "./list-editor";

export function ProductForm({
  product,
  categories,
  storageReady,
}: {
  product?: Product;
  categories: Pick<Category, "id" | "name">[];
  storageReady: boolean;
}) {
  const [state, action] = useActionState(saveProduct.bind(null, product?.id ?? null), {} as ActionState);
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_360px]" noValidate>
      <div className="space-y-6">
        <Card title="Basic information">
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Product name" name="name" required error={e.name} className="sm:col-span-2">
              <Input name="name" defaultValue={product?.name} placeholder="Crystal Clear Glycerin Soap Base" />
            </Field>
            <Field label="URL slug" name="slug" hint="Leave blank to create it from the name" error={e.slug}>
              <Input name="slug" defaultValue={product?.slug} placeholder="crystal-clear-glycerin-soap-base" />
            </Field>
            <Field label="SKU" name="sku" required error={e.sku}>
              <Input name="sku" defaultValue={product?.sku} placeholder="SB-TR-001" />
            </Field>
            <Field label="Category" name="categoryId" required error={e.categoryId}>
              <Select name="categoryId" defaultValue={product?.categoryId ?? ""}>
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Badge" name="badge" hint='e.g. "Best Seller", "New", "Premium"' error={e.badge}>
              <Input name="badge" defaultValue={product?.badge ?? ""} />
            </Field>
            <Field label="Short description" name="shortDescription" required hint="Shown on product cards" error={e.shortDescription} className="sm:col-span-2">
              <Input name="shortDescription" defaultValue={product?.shortDescription} maxLength={220} />
            </Field>
            <Field label="Full description" name="description" required error={e.description} className="sm:col-span-2">
              <Textarea name="description" defaultValue={product?.description} rows={5} />
            </Field>
          </div>
        </Card>

        <Card title="Images">
          <div className="p-5">
            <ImageUploader name="images" folder="products" defaultValue={product?.images ?? []} storageReady={storageReady} />
            <p className="mt-2 text-xs text-muted">The first image is the cover shown on product cards. Without images, the site draws a soap bar in the product colour.</p>
          </div>
        </Card>

        <Card title="Pricing & ordering">
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Wholesale price (Rs per kg)" name="pricePerKg" required hint="Base tier. Volume discounts (5%, 8%, 12%) are applied automatically" error={e.pricePerKg}>
              <Input name="pricePerKg" type="number" min={1} defaultValue={product?.pricePerKg} />
            </Field>
            <Field label="Minimum order (kg)" name="moq" required error={e.moq}>
              <Input name="moq" type="number" min={1} defaultValue={product?.moq ?? 25} />
            </Field>
            <Field label="Pack sizes" name="packSizes" className="sm:col-span-2">
              <ListEditor name="packSizes" defaultValue={product?.packSizes ?? ["1 kg block", "5 kg slab", "10 kg carton", "25 kg carton"]} placeholder="e.g. 25 kg carton" />
            </Field>
          </div>
        </Card>

        <Card title="Features & specifications">
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <Field label="Key features" name="features" className="sm:col-span-3">
              <ListEditor name="features" defaultValue={product?.features ?? []} placeholder="e.g. Low sweat formula" />
            </Field>
            <Field label="pH level" name="phLevel" error={e.phLevel}>
              <Input name="phLevel" defaultValue={product?.phLevel} placeholder="9.5 – 10.0" />
            </Field>
            <Field label="Melting point" name="meltPoint" error={e.meltPoint}>
              <Input name="meltPoint" defaultValue={product?.meltPoint} placeholder="60 – 65 °C" />
            </Field>
            <Field label="Shelf life" name="shelfLife" error={e.shelfLife}>
              <Input name="shelfLife" defaultValue={product?.shelfLife} placeholder="24 months" />
            </Field>
            <Field label="Ingredients (INCI)" name="ingredients" error={e.ingredients} className="sm:col-span-3">
              <Textarea name="ingredients" defaultValue={product?.ingredients} rows={2} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Visibility">
          <div className="space-y-3 p-5">
            <Toggle name="isActive" label="Published" description="Show this product on the website" defaultChecked={product?.isActive ?? true} />
            <Toggle name="featured" label="Featured" description="Show on the home page best sellers" defaultChecked={product?.featured ?? false} />
          </div>
        </Card>

        <Card title="Stock">
          <div className="space-y-4 p-5">
            {product ? (
              <p className="rounded-xl bg-mist p-3 text-sm">
                Current stock: <span className="font-extrabold text-navy">{product.stockKg} kg</span>
                <br />
                <Link href={`/admin/stock?product=${product.id}`} className="font-semibold text-brand underline">Adjust in Stock →</Link>
              </p>
            ) : (
              <Field label="Opening stock (kg)" name="openingStock" error={e.openingStock}>
                <Input name="openingStock" type="number" min={0} defaultValue={0} />
              </Field>
            )}
            <Field label="Low-stock alert at (kg)" name="lowStockThreshold" error={e.lowStockThreshold}>
              <Input name="lowStockThreshold" type="number" min={0} defaultValue={product?.lowStockThreshold ?? 100} />
            </Field>
          </div>
        </Card>

        <Card title="Visual colour">
          <div className="p-5">
            <Field label="Soap colour (hex)" name="color" hint="Used to draw the soap bar when there are no photos. Leave blank to use the category colour." error={e.color}>
              <div className="flex gap-2">
                <Input name="color" defaultValue={product?.color ?? ""} placeholder="#cfeef5" />
              </div>
            </Field>
          </div>
        </Card>

        <div className="sticky bottom-4 space-y-3 rounded-2xl border border-navy/8 bg-white p-4 shadow-lift">
          <FormError state={state} />
          <SubmitButton className="w-full">{product ? "Save changes" : "Create product"}</SubmitButton>
          <Link href="/admin/products" className={`${btn("outline")} w-full`}>Cancel</Link>
        </div>
      </div>
    </form>
  );
}
