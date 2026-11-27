"use client";

import { CheckCircle2, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/** Shows `?toast=...` messages set by server actions after redirects, then cleans the URL. */
export function Toast() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const message = params.get("toast");
  const [visible, setVisible] = useState<string | null>(null);
  const [seen, setSeen] = useState<string | null>(null);

  // Pick up a new message during render (no effect-driven setState).
  if (message && message !== seen) {
    setSeen(message);
    setVisible(message);
  }

  // Remove ?toast from the URL so refreshes don't repeat it.
  useEffect(() => {
    if (!message) return;
    const next = new URLSearchParams(params.toString());
    next.delete("toast");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [message, params, pathname, router]);

  // Auto-hide after 4 seconds.
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setVisible(null);
      setSeen(null);
    }, 4000);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;
  return (
    <div
      role="status"
      className="animate-fade-up fixed right-4 bottom-4 left-4 z-70 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-white shadow-lift sm:left-auto"
    >
      <CheckCircle2 className="size-5 shrink-0 text-brand-400" />
      <span className="flex-1">{visible}</span>
      <button type="button" onClick={() => setVisible(null)} aria-label="Dismiss" className="rounded-lg p-1 hover:bg-white/10">
        <X className="size-4" />
      </button>
    </div>
  );
}
