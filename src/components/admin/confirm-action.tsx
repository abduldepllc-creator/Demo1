"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { btn, type BtnVariant } from "./styles";
import { ConfirmDialog, type ConfirmTone } from "./confirm-dialog";

/**
 * A button that asks for confirmation in a themed modal, then runs a server action
 * (used for deletes, approvals and status changes).
 * `action` must be a bound server action, e.g. deleteProduct.bind(null, id).
 */
export function ConfirmAction({
  action,
  message = "Are you sure? This cannot be undone.",
  title,
  label = "Delete",
  confirmLabel,
  variant = "dangerSoft",
  tone,
  size = "sm",
  icon = true,
  className,
}: {
  action: () => Promise<unknown>;
  message?: string;
  title?: string;
  label?: string;
  confirmLabel?: string;
  variant?: BtnVariant;
  tone?: ConfirmTone;
  size?: "sm" | "md";
  icon?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const isDanger = variant === "danger" || variant === "dangerSoft";
  const resolvedTone: ConfirmTone = tone ?? (isDanger ? "danger" : variant === "primary" ? "success" : "neutral");
  // "Delete "X"? Its reviews will also go." → title: "Delete "X"?", description: the rest.
  const q = message.indexOf("?");
  const splitTitle = q > 0 ? message.slice(0, q + 1).trim() : null;
  const resolvedTitle = title ?? splitTitle ?? `${label}?`;
  const rest = title || !splitTitle ? message : message.slice(q + 1).trim();
  const description =
    rest || (resolvedTone === "danger" ? "This action can't be undone." : "You can change this again at any time.");

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
  }, []);

  const confirm = () =>
    start(async () => {
      try {
        await action();
        // Most admin actions redirect (with a toast); close in case this one doesn't.
        setOpen(false);
      } catch (err) {
        // Redirects are thrown as special errors and handled by Next.js; re-throw them.
        if (err && typeof err === "object" && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")) throw err;
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    });

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className={cn(btn(variant, size), className)}
      >
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : icon && isDanger ? <Trash2 className="size-3.5" /> : null}
        {label}
      </button>
      <ConfirmDialog
        open={open}
        title={resolvedTitle}
        message={description}
        confirmLabel={confirmLabel ?? label}
        tone={resolvedTone}
        pending={pending}
        error={error}
        onConfirm={confirm}
        onClose={close}
      />
    </>
  );
}
