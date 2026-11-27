"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveReview } from "@/actions/admin/reviews";
import { REVIEW_STATUSES, type Review } from "@/db/schema";
import { Card } from "./ui";
import { Field, FormError, Input, Select, SubmitButton, Textarea, type ActionState } from "./form";
import { btn } from "./styles";

export function AdminReviewForm({ review, products }: { review?: Review; products: { id: number; name: string }[] }) {
  const [state, action] = useActionState(saveReview.bind(null, review?.id ?? null), {} as ActionState);
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate className="max-w-3xl">
      <Card title="Review">
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Product" name="productId" required error={e.productId} className="sm:col-span-2">
            <Select name="productId" defaultValue={review?.productId ?? ""}>
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Reviewer name" name="name" required error={e.name}>
            <Input name="name" defaultValue={review?.name} />
          </Field>
          <Field label="Rating" name="rating" required error={e.rating}>
            <Select name="rating" defaultValue={review?.rating ?? 5}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
              ))}
            </Select>
          </Field>
          <Field label="Company" name="company" error={e.company}>
            <Input name="company" defaultValue={review?.company ?? ""} />
          </Field>
          <Field label="City" name="city" error={e.city}>
            <Input name="city" defaultValue={review?.city ?? ""} />
          </Field>
          <Field label="Title" name="title" error={e.title} className="sm:col-span-2">
            <Input name="title" defaultValue={review?.title ?? ""} />
          </Field>
          <Field label="Comment" name="comment" required error={e.comment} className="sm:col-span-2">
            <Textarea name="comment" defaultValue={review?.comment} rows={4} />
          </Field>
          <Field label="Status" name="status" hint="Only approved reviews show on the website" error={e.status}>
            <Select name="status" defaultValue={review?.status ?? "approved"}>
              {REVIEW_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-navy/8 p-4 sm:flex-row sm:items-center sm:justify-end">
          <FormError state={state} />
          <Link href="/admin/reviews" className={btn("outline")}>Cancel</Link>
          <SubmitButton>{review ? "Save review" : "Add review"}</SubmitButton>
        </div>
      </Card>
    </form>
  );
}
