"use client";

import { CheckCircle2, Loader2, Star } from "lucide-react";
import { useActionState, useState } from "react";
import { submitReview } from "@/actions/public";
import { cn } from "@/lib/utils";
import type { FormState } from "@/types";

export function ReviewForm({ productId }: { productId: number }) {
  const [state, action, pending] = useActionState(submitReview, { status: "idle" } as FormState);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const e = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-brand/20 bg-brand-50 p-8 text-center">
        <CheckCircle2 className="size-10 text-brand" />
        <p className="mt-3 font-extrabold text-navy">Review submitted</p>
        <p className="mt-1 text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4 rounded-3xl border border-navy/8 bg-white p-6 shadow-soft sm:p-7" noValidate>
      <h3 className="text-lg font-extrabold text-navy">Write a review</h3>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating || ""} />
      {/* Honeypot (hidden from humans) */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <p className="mb-1.5 text-sm font-bold text-navy">Your rating *</p>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star className={cn("size-7", n <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-navy/20")} />
            </button>
          ))}
        </div>
        {e.rating?.[0] && <p className="mt-1 text-xs font-semibold text-red-600">{e.rating[0]}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="r-name" className="mb-1.5 block text-sm font-bold text-navy">Name *</label>
          <input id="r-name" name="name" className="input" autoComplete="name" />
          {e.name?.[0] && <p className="mt-1 text-xs font-semibold text-red-600">{e.name[0]}</p>}
        </div>
        <div>
          <label htmlFor="r-city" className="mb-1.5 block text-sm font-bold text-navy">City</label>
          <input id="r-city" name="city" className="input" />
        </div>
      </div>
      <div>
        <label htmlFor="r-company" className="mb-1.5 block text-sm font-bold text-navy">Company / brand</label>
        <input id="r-company" name="company" className="input" autoComplete="organization" />
      </div>
      <div>
        <label htmlFor="r-title" className="mb-1.5 block text-sm font-bold text-navy">Title</label>
        <input id="r-title" name="title" className="input" placeholder="Sum it up in a few words" />
      </div>
      <div>
        <label htmlFor="r-comment" className="mb-1.5 block text-sm font-bold text-navy">Your review *</label>
        <textarea id="r-comment" name="comment" rows={4} className="input resize-none" placeholder="How did this soap base work for you?" />
        {e.comment?.[0] && <p className="mt-1 text-xs font-semibold text-red-600">{e.comment[0]}</p>}
      </div>
      {state.status === "error" && state.message && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        {pending ? <Loader2 className="size-5 animate-spin" /> : null}
        {pending ? "Submitting…" : "Submit review"}
      </button>
      <p className="text-center text-xs text-muted">Reviews are published after a quick check by our team.</p>
    </form>
  );
}
