"use client";

import { AlertTriangle, CheckCircle2, HelpCircle, Loader2, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type ConfirmTone = "danger" | "success" | "neutral";

const TONES: Record<ConfirmTone, { icon: typeof AlertTriangle; iconWrap: string; button: string }> = {
  danger: { icon: AlertTriangle, iconWrap: "bg-red-50 text-red-600 ring-red-100", button: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-200" },
  success: { icon: CheckCircle2, iconWrap: "bg-brand-50 text-brand ring-brand-100", button: "bg-brand hover:bg-brand-600 focus-visible:ring-brand-100" },
  neutral: { icon: HelpCircle, iconWrap: "bg-navy-50 text-navy ring-navy-100", button: "bg-navy hover:bg-navy-700 focus-visible:ring-navy-100" },
};

/**
 * Accessible, themed confirmation dialog (replaces window.confirm).
 * Centered card on larger screens, bottom sheet on phones.
 * Esc / backdrop closes; focus is trapped inside and restored afterwards.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "neutral",
  pending = false,
  error,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  pending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const t = TONES[tone];

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Safer default focus: Cancel for destructive actions, Confirm otherwise.
    const focusTarget = tone === "danger" ? cancelRef.current : panelRef.current?.querySelector<HTMLButtonElement>("[data-confirm]");
    focusTarget?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, pending, onClose, tone]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-90 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="animate-overlay-in absolute inset-0 bg-navy-900/55 backdrop-blur-sm" onClick={() => !pending && onClose()} aria-hidden="true" />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="animate-sheet-up sm:animate-dialog-in relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-lift sm:rounded-3xl sm:p-7"
      >
        <span className="mx-auto mb-4 block h-1.5 w-12 rounded-full bg-navy/10 sm:hidden" aria-hidden="true" />
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          aria-label="Close"
          className="absolute top-4 right-4 hidden size-9 place-items-center rounded-xl text-muted transition-colors hover:bg-mist hover:text-navy disabled:opacity-40 sm:grid"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
          <span className={cn("grid size-14 shrink-0 place-items-center rounded-2xl ring-8", t.iconWrap)}>
            <t.icon className="size-7" />
          </span>
          <div className="mt-4 min-w-0 sm:mt-0 sm:pr-6">
            <h2 id={titleId} className="text-lg font-extrabold text-navy">{title}</h2>
            <p id={descId} className="mt-1.5 text-sm leading-relaxed text-muted">{message}</p>
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-mist focus-visible:ring-4 focus-visible:ring-navy-100 focus-visible:outline-none disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            data-confirm
            onClick={onConfirm}
            disabled={pending}
            className={cn(
              "inline-flex min-w-28 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-colors focus-visible:ring-4 focus-visible:outline-none disabled:opacity-80",
              t.button,
            )}
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
