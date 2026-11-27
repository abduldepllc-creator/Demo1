"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { submitInquiry } from "@/actions/inquiry";
import { CITIES } from "@/constants";
import { cn } from "@/lib/utils";
import type { FormState } from "@/types";

const initial: FormState = { status: "idle" };

function Field({
  label,
  name,
  error,
  required,
  children,
  className,
}: {
  label: string;
  name: string;
  error?: string[];
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-bold text-navy">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      {children}
      {error?.[0] && <p className="mt-1.5 text-xs font-semibold text-red-600">{error[0]}</p>}
    </div>
  );
}

export function QuoteForm({ products }: { products: { slug: string; name: string }[] }) {
  const searchParams = useSearchParams();
  const preProduct = products.find((p) => p.slug === searchParams.get("product"))?.name ?? "";
  const preQty = searchParams.get("qty") ?? "";

  const [state, action, pending] = useActionState(submitInquiry, initial);
  const [formKey, setFormKey] = useState(0);
  const errors = state.fieldErrors ?? {};

  return (
    <div className="relative overflow-hidden rounded-4xl border border-navy/8 bg-white p-6 shadow-lift sm:p-9">
      <AnimatePresence mode="wait">
        {state.status === "success" && formKey === 0 ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-14 text-center"
          >
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}
              className="grid size-20 place-items-center rounded-full bg-brand text-white shadow-glow"
            >
              <CheckCircle2 className="size-10" />
            </motion.span>
            <h3 className="mt-6 text-2xl font-extrabold text-navy">Quote request received!</h3>
            <p className="mt-2 max-w-sm text-muted">{state.message}</p>
            <button type="button" onClick={() => setFormKey((k) => k + 1)} className="btn btn-outline mt-8">
              Send another request
            </button>
          </motion.div>
        ) : (
          <motion.form
            key={`form-${formKey}`}
            action={(fd) => {
              if (formKey > 0) setFormKey(0);
              return action(fd);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-5 sm:grid-cols-2"
            noValidate
          >
            <div className="sm:col-span-2">
              <h2 className="text-2xl font-extrabold text-navy sm:text-3xl">Request a bulk quote</h2>
              <p className="mt-1 text-sm text-muted">Fill in the details — we reply within 24 hours (usually much sooner).</p>
            </div>

            <Field label="Full name" name="name" required error={errors.name}>
              <input id="name" name="name" autoComplete="name" className="input" placeholder="Muhammad Ali" />
            </Field>
            <Field label="Company / brand" name="company" error={errors.company}>
              <input id="company" name="company" autoComplete="organization" className="input" placeholder="Your business name" />
            </Field>
            <Field label="Phone / WhatsApp" name="phone" required error={errors.phone}>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className="input" placeholder="+92 3XX XXXXXXX" />
            </Field>
            <Field label="Email" name="email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" className="input" placeholder="you@company.pk" />
            </Field>
            <Field label="City" name="city" error={errors.city}>
              <select id="city" name="city" className="input" defaultValue="">
                <option value="">Select your city</option>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
                <option>Other</option>
              </select>
            </Field>
            <Field label="Estimated quantity (kg)" name="quantityKg" error={errors.quantityKg}>
              <input
                id="quantityKg"
                name="quantityKg"
                type="number"
                min={1}
                inputMode="numeric"
                className="input"
                placeholder="e.g. 250"
                defaultValue={preQty}
              />
            </Field>
            <Field label="Product of interest" name="product" error={errors.product} className="sm:col-span-2">
              <select id="product" name="product" className="input" defaultValue={preProduct}>
                <option value="">Not sure yet / multiple products</option>
                {products.map((p) => (
                  <option key={p.slug} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Message" name="message" error={errors.message} className="sm:col-span-2">
              <textarea
                id="message"
                name="message"
                rows={4}
                className="input resize-none"
                placeholder="Tell us about your requirements, delivery timeline or custom formulation needs…"
              />
            </Field>

            <AnimatePresence>
              {state.status === "error" && state.message && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:col-span-2"
                >
                  {state.message}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={pending}
              className={cn("btn btn-primary group py-4! text-base sm:col-span-2", pending && "opacity-80")}
            >
              {pending ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send Quote Request
                  <Send className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
