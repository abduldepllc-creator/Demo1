import { cn } from "@/lib/utils";

/** Admin button classes (usable from server and client components). */
export type BtnVariant = "primary" | "navy" | "outline" | "danger" | "dangerSoft" | "ghost";

export function btn(variant: BtnVariant = "primary", size: "sm" | "md" = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold whitespace-nowrap transition-colors disabled:cursor-not-allowed",
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
    {
      primary: "bg-brand text-white hover:bg-brand-600",
      navy: "bg-navy text-white hover:bg-navy-700",
      outline: "border border-navy/15 bg-white text-navy hover:bg-mist",
      danger: "bg-red-600 text-white hover:bg-red-700",
      dangerSoft: "border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50",
      ghost: "text-muted hover:bg-mist hover:text-navy",
    }[variant],
  );
}
