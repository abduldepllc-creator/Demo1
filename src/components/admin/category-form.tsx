"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveCategory } from "@/actions/admin/categories";
import type { Category } from "@/db/schema";
import { SoapBlock } from "@/components/shared/soap-block";
import { Card } from "./ui";
import { Field, FormError, Input, SubmitButton, Textarea, Toggle, type ActionState } from "./form";
import { btn } from "./styles";
import { ImageUploader } from "./image-uploader";
import { BenefitEditor, ListEditor } from "./list-editor";

export function CategoryForm({ category, storageReady }: { category?: Category; storageReady: boolean }) {
  const [state, action] = useActionState(saveCategory.bind(null, category?.id ?? null), {} as ActionState);
  const [color, setColor] = useState(category?.color ?? "#cfeef5");
  const [translucent, setTranslucent] = useState(category?.translucent ?? false);
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_340px]" noValidate>
      <div className="space-y-6">
        <Card title="Category details">
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Name" name="name" required error={e.name}>
              <Input name="name" defaultValue={category?.name} placeholder="Transparent Soap Base" />
            </Field>
            <Field label="URL slug" name="slug" hint="Leave blank to create it from the name" error={e.slug}>
              <Input name="slug" defaultValue={category?.slug} placeholder="transparent" />
            </Field>
            <Field label="Tagline" name="tagline" error={e.tagline} className="sm:col-span-2">
              <Input name="tagline" defaultValue={category?.tagline} placeholder="Crystal clear glycerin melt & pour" />
            </Field>
            <Field label="Description" name="description" error={e.description} className="sm:col-span-2">
              <Textarea name="description" defaultValue={category?.description} rows={3} />
            </Field>
            <Field label="Sort order" name="sortOrder" hint="Lower numbers show first" error={e.sortOrder}>
              <Input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
            </Field>
          </div>
        </Card>

        <Card title="Landing page content">
          <div className="grid gap-4 p-5">
            <Field label="Headline" name="headline" hint="Shown above the benefits on /categories/[slug]" error={e.headline}>
              <Input name="headline" defaultValue={category?.headline} placeholder="Glass-like clarity that lets your designs shine" />
            </Field>
            <Field label="Benefits" name="benefits">
              <BenefitEditor name="benefits" defaultValue={category?.benefits} />
            </Field>
            <Field label="Ideal for (applications)" name="applications">
              <ListEditor name="applications" defaultValue={category?.applications ?? []} placeholder="e.g. Gift & festive soaps" />
            </Field>
            <Field label="Pro tip" name="proTip" error={e.proTip}>
              <Textarea name="proTip" defaultValue={category?.proTip} rows={2} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Appearance">
          <div className="space-y-4 p-5">
            <div className="grid place-items-center rounded-xl bg-mist p-4">
              <SoapBlock color={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#cfeef5"} translucent={translucent} className="w-40" />
            </div>
            <Field label="Soap colour" name="color" required error={e.color}>
              <div className="flex gap-2">
                <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#cfeef5"} onChange={(ev) => setColor(ev.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-navy/12" aria-label="Pick colour" />
                <Input name="color" value={color} onChange={(ev) => setColor(ev.target.value)} />
              </div>
            </Field>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-navy">
              <input type="checkbox" name="translucent" checked={translucent} onChange={(ev) => setTranslucent(ev.target.checked)} className="size-4 accent-brand" />
              Translucent (clear) base
            </label>
            <Field label="Category image (optional)" name="imageUrl" hint="Replaces the drawn soap bar on category cards">
              <ImageUploader name="imageUrl" folder="categories" max={1} defaultValue={category?.imageUrl ? [category.imageUrl] : []} storageReady={storageReady} />
            </Field>
          </div>
        </Card>

        <Card title="Visibility">
          <div className="p-5">
            <Toggle name="isActive" label="Published" description="Hidden categories also hide their products" defaultChecked={category?.isActive ?? true} />
          </div>
        </Card>

        <div className="sticky bottom-4 space-y-3 rounded-2xl border border-navy/8 bg-white p-4 shadow-lift">
          <FormError state={state} />
          <SubmitButton className="w-full">{category ? "Save changes" : "Create category"}</SubmitButton>
          <Link href="/admin/categories" className={`${btn("outline")} w-full`}>Cancel</Link>
        </div>
      </div>
    </form>
  );
}
