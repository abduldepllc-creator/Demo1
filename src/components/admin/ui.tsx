import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox, Search, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ─── Layout ─────────────────────────────────────────────────────────── */

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-navy">
            <ChevronLeft className="size-4" /> {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className, title, actions }: { children: ReactNode; className?: string; title?: ReactNode; actions?: ReactNode }) {
  return (
    // min-w-0: lets cards shrink inside grid/flex tracks so wide content never overflows small screens
    <section className={cn("min-w-0 rounded-2xl border border-navy/8 bg-white shadow-[0_1px_2px_rgba(13,44,80,0.04)]", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-navy/8 px-5 py-4">
          {title && <h2 className="font-extrabold text-navy">{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "navy",
  href,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: LucideIcon;
  tone?: "navy" | "green" | "amber" | "red";
  href?: string;
}) {
  const tones = {
    navy: "bg-navy-50 text-navy",
    green: "bg-brand-50 text-brand-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  };
  const body = (
    <div className="flex h-full items-start justify-between gap-3 rounded-2xl border border-navy/8 bg-white p-4 transition-shadow hover:shadow-soft sm:p-5">
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-wide text-muted uppercase">{label}</p>
        <p className="mt-2 truncate text-2xl font-extrabold text-navy tabular-nums">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-5" />
      </span>
    </div>
  );
  return href ? <Link href={href} className="block h-full min-w-0">{body}</Link> : body;
}

/* ─── Badges ─────────────────────────────────────────────────────────── */

const BADGE_TONES: Record<string, string> = {
  // order status
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-600/20",
  processing: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  shipped: "bg-violet-50 text-violet-700 ring-violet-600/20",
  delivered: "bg-brand-50 text-brand-700 ring-brand-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  // payment
  unpaid: "bg-red-50 text-red-700 ring-red-600/20",
  partial: "bg-amber-50 text-amber-700 ring-amber-600/20",
  paid: "bg-brand-50 text-brand-700 ring-brand-600/20",
  refunded: "bg-slate-100 text-slate-700 ring-slate-600/20",
  // reviews
  approved: "bg-brand-50 text-brand-700 ring-brand-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  // inquiries
  new: "bg-sky-50 text-sky-700 ring-sky-600/20",
  contacted: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  quoted: "bg-violet-50 text-violet-700 ring-violet-600/20",
  converted: "bg-brand-50 text-brand-700 ring-brand-600/20",
  closed: "bg-slate-100 text-slate-700 ring-slate-600/20",
  // subscribers / generic
  subscribed: "bg-brand-50 text-brand-700 ring-brand-600/20",
  unsubscribed: "bg-slate-100 text-slate-700 ring-slate-600/20",
  active: "bg-brand-50 text-brand-700 ring-brand-600/20",
  draft: "bg-slate-100 text-slate-700 ring-slate-600/20",
  "in stock": "bg-brand-50 text-brand-700 ring-brand-600/20",
  "low stock": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "out of stock": "bg-red-50 text-red-700 ring-red-600/20",
  in: "bg-brand-50 text-brand-700 ring-brand-600/20",
  out: "bg-red-50 text-red-700 ring-red-600/20",
  adjustment: "bg-sky-50 text-sky-700 ring-sky-600/20",
};

export function Badge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset whitespace-nowrap",
        BADGE_TONES[value.toLowerCase()] ?? "bg-slate-100 text-slate-700 ring-slate-600/20",
        className,
      )}
    >
      {value.charAt(0).toUpperCase() + value.slice(1)}
    </span>
  );
}

export function stockStatus(stockKg: number, threshold: number) {
  if (stockKg <= 0) return "out of stock";
  if (stockKg <= threshold) return "low stock";
  return "in stock";
}

/* ─── Tables (scroll horizontally on small screens) ──────────────────── */

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn("border-b border-navy/8 bg-mist/60 px-4 py-3 text-xs font-bold tracking-wide whitespace-nowrap text-muted uppercase", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("border-b border-navy/5 px-4 py-3 align-middle", className)}>{children}</td>;
}

export function EmptyState({ title, text, action, icon: Icon = Inbox }: { title: string; text?: string; action?: ReactNode; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-mist text-muted">
        <Icon className="size-6" />
      </span>
      <p className="mt-4 font-extrabold text-navy">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ─── Filters & pagination (plain links/GET forms: work without JS) ─── */

export function SearchBar({
  placeholder = "Search…",
  defaultValue,
  hidden = {},
}: {
  placeholder?: string;
  defaultValue?: string;
  hidden?: Record<string, string | undefined>;
}) {
  return (
    <form method="get" className="relative w-full sm:max-w-xs" role="search">
      {Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-xl border border-navy/12 bg-white py-2.5 pr-3 pl-9 text-sm focus:border-brand focus:ring-4 focus:ring-brand/15 focus:outline-none"
      />
    </form>
  );
}

export function FilterTabs({
  options,
  active,
  hrefFor,
}: {
  options: { value: string; label: string; count?: number }[];
  active: string;
  hrefFor: (value: string) => string;
}) {
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 scrollbar-none" aria-label="Filter">
      {options.map((o) => (
        <Link
          key={o.value}
          href={hrefFor(o.value)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold capitalize transition-colors",
            active === o.value ? "bg-navy text-white" : "text-muted hover:bg-white hover:text-navy",
          )}
        >
          {o.label}
          {o.count !== undefined && (
            <span className={cn("rounded-md px-1.5 text-xs", active === o.value ? "bg-white/20" : "bg-navy/5")}>{o.count}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}

export function Pagination({ page, pageCount, hrefFor }: { page: number; pageCount: number; hrefFor: (p: number) => string }) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-navy/8 px-4 py-3 text-sm">
      <p className="text-muted">
        Page <span className="font-bold text-navy">{page}</span> of {pageCount}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className="flex items-center gap-1 rounded-lg border border-navy/12 px-3 py-1.5 font-semibold hover:bg-mist">
            <ChevronLeft className="size-4" /> Prev
          </Link>
        ) : null}
        {page < pageCount ? (
          <Link href={hrefFor(page + 1)} className="flex items-center gap-1 rounded-lg border border-navy/12 px-3 py-1.5 font-semibold hover:bg-mist">
            Next <ChevronRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** Build a query-string URL, dropping empty values. */
export function buildHref(base: string, params: Record<string, string | number | undefined | null>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

export function formatDate(d: Date | string, withTime = false) {
  return new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    timeZone: "Asia/Karachi",
  });
}
