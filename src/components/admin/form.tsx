"use client";

import { Loader2 } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { btn } from "./styles";

export type ActionState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string[] | undefined> };

const control =
  "w-full rounded-xl border border-navy/12 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/15 focus:outline-none disabled:bg-mist";

export function Field({
  label,
  name,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  name: string;
  hint?: ReactNode;
  error?: string[];
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-bold text-navy">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      {children}
      {error?.[0] ? (
        <p className="mt-1 text-xs font-semibold text-red-600">{error[0]}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input id={props.name} {...props} className={cn(control, className)} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea id={props.name} rows={4} {...props} className={cn(control, "resize-y", className)} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select id={props.name} {...props} className={cn(control, "cursor-pointer pr-8", className)}>
      {children}
    </select>
  );
}

export function Toggle({ name, label, description, defaultChecked }: { name: string; label: string; description?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-navy/10 p-3.5 transition-colors hover:bg-mist/60">
      <span>
        <span className="block text-sm font-bold text-navy">{label}</span>
        {description && <span className="block text-xs text-muted">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand/20" />
        <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function SubmitButton({
  children,
  pendingText = "Saving…",
  className,
  variant = "primary",
}: {
  children: ReactNode;
  pendingText?: string;
  className?: string;
  variant?: "primary" | "navy" | "outline" | "danger";
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(btn(variant), pending && "opacity-70", className)}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? pendingText : children}
    </button>
  );
}

export function FormError({ state }: { state: ActionState }) {
  if (!state.error) return null;
  return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{state.error}</p>;
}
