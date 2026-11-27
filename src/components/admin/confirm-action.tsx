"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { btn, type BtnVariant } from "./styles";

/**
 * Runs a server action after a confirmation prompt (used for deletes & bulk status changes).
 * `action` must be a bound server action, e.g. deleteProduct.bind(null, id).
 */
export function ConfirmAction({
  action,
  message = "Are you sure? This cannot be undone.",
  label = "Delete",
  variant = "dangerSoft",
  size = "sm",
  icon = true,
  className,
}: {
  action: () => Promise<unknown>;
  message?: string;
  label?: string;
  variant?: BtnVariant;
  size?: "sm" | "md";
  icon?: boolean;
  className?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(message)) start(async () => void (await action()));
      }}
      className={cn(btn(variant, size), className)}
    >
      {pending ? <Loader2 className="size-3.5 animate-spin" /> : icon && (variant === "danger" || variant === "dangerSoft") ? <Trash2 className="size-3.5" /> : null}
      {label}
    </button>
  );
}
