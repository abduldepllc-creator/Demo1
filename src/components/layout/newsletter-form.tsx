"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useActionState } from "react";
import { subscribeNewsletter } from "@/actions/public";
import type { FormState } from "@/types";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribeNewsletter, { status: "idle" } as FormState);

  if (state.status === "success") {
    return (
      <p className="flex items-center gap-2 rounded-2xl bg-brand/15 px-4 py-3 text-sm font-semibold text-brand-400">
        <CheckCircle2 className="size-5 shrink-0" /> {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="w-full" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@business.pk"
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button type="submit" disabled={pending} className="btn btn-primary shrink-0 py-3!">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Subscribe
        </button>
      </div>
      {state.status === "error" && <p className="mt-2 text-xs font-semibold text-red-300">{state.message}</p>}
    </form>
  );
}
