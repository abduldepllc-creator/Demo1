"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Calculator, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { whatsappLink } from "@/config/site";
import { getPriceTiers, priceFor } from "@/lib/pricing";
import { cn, formatPKR } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/shared/icons";

const PRESETS = [50, 100, 500, 1000];

export function QuantityCalculator({
  slug,
  name,
  pricePerKg,
  moq,
}: {
  slug: string;
  name: string;
  pricePerKg: number;
  moq: number;
}) {
  const [qty, setQty] = useState(Math.max(moq, 100));
  const safeQty = Math.max(moq, qty || 0);
  const { tier, unit, total } = priceFor(pricePerKg, safeQty, moq);
  const savings = pricePerKg * safeQty - total;
  const tiers = getPriceTiers(moq);

  const step = (d: number) => setQty((q) => Math.max(moq, (q || 0) + d));

  return (
    <div className="rounded-3xl border border-navy/8 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand">
          <Calculator className="size-5" />
        </span>
        <h2 className="text-base font-extrabold text-navy">Bulk price calculator</h2>
      </div>

      <label className="mt-5 block text-xs font-bold tracking-wider text-muted uppercase" htmlFor="qty">
        Quantity (kg)
      </label>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => step(-25)}
          aria-label="Decrease quantity"
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mist text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <Minus className="size-4" />
        </button>
        <input
          id="qty"
          type="number"
          inputMode="numeric"
          min={moq}
          step={5}
          value={qty || ""}
          onChange={(e) => setQty(Number(e.target.value))}
          onBlur={() => setQty(safeQty)}
          className="input !py-3 text-center text-lg font-extrabold"
        />
        <button
          type="button"
          onClick={() => step(25)}
          aria-label="Increase quantity"
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mist text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.filter((p) => p >= moq).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setQty(p)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold transition-colors",
              safeQty === p ? "bg-navy text-white" : "bg-mist text-navy hover:bg-navy-50",
            )}
          >
            {p >= 1000 ? `${p / 1000} ton` : `${p} kg`}
          </button>
        ))}
      </div>

      {/* Tier progress */}
      <div className="mt-5 grid grid-cols-4 gap-1.5">
        {tiers.map((t) => (
          <div key={t.label} className="text-center">
            <div
              className={cn(
                "h-1.5 rounded-full transition-colors duration-500",
                safeQty >= t.min ? "bg-brand" : "bg-mist",
              )}
            />
            <p className={cn("mt-1.5 text-[10px] font-bold sm:text-[11px]", tier.label === t.label ? "text-brand" : "text-muted")}>
              {t.discount ? `-${Math.round(t.discount * 100)}%` : "Base"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 rounded-2xl bg-mist p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Price tier</span>
          <span className="font-bold text-navy">{tier.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">Unit price</span>
          <span className="font-bold text-navy">{formatPKR(unit)}/kg</span>
        </div>
        <AnimatePresence>
          {savings > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between overflow-hidden"
            >
              <span className="text-muted">You save</span>
              <span className="font-bold text-brand">{formatPKR(savings)}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-end justify-between border-t border-navy/10 pt-3">
          <span className="font-semibold text-navy">Estimated total</span>
          <motion.span
            key={Math.round(total)}
            initial={{ opacity: 0.4, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-extrabold text-navy"
          >
            {formatPKR(total)}
          </motion.span>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted">Estimate excludes delivery. Final pricing confirmed in your quote.</p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Link href={`/contact?product=${slug}&qty=${safeQty}`} className="btn btn-primary">
          Request Quote
        </Link>
        <a
          href={whatsappLink(`Hi SoapBase! I'd like a quote for ${safeQty} kg of ${name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          <WhatsAppIcon className="size-5 text-[#25D366]" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
