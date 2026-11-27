"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { priceFor } from "@/lib/pricing";
import { formatPKR } from "@/lib/utils";

export type ProductOption = { id: number; name: string; sku: string; pricePerKg: number; moq: number; stockKg: number };
type Line = { key: number; productId: number; quantityKg: number; unitPrice: number };

/**
 * Order line items with live totals. Unit price defaults to the public volume-tier
 * price and can be overridden for negotiated deals.
 */
export function OrderItemsEditor({
  products,
  defaultItems = [],
  defaultDiscount = 0,
  defaultDeliveryFee = 0,
}: {
  products: ProductOption[];
  defaultItems?: { productId: number; quantityKg: number; unitPrice: number }[];
  defaultDiscount?: number;
  defaultDeliveryFee?: number;
}) {
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const [lines, setLines] = useState<Line[]>(() =>
    defaultItems.length ? defaultItems.map((it, i) => ({ ...it, key: i })) : [],
  );
  const [nextKey, setNextKey] = useState(defaultItems.length + 1);
  const [discount, setDiscount] = useState(defaultDiscount);
  const [deliveryFee, setDeliveryFee] = useState(defaultDeliveryFee);

  const tierPrice = (productId: number, qty: number) => {
    const p = byId.get(productId);
    return p ? Math.round(priceFor(p.pricePerKg, qty, p.moq).unit) : 0;
  };

  const addLine = () => {
    const first = products[0];
    if (!first) return;
    const qty = Math.max(first.moq, 25);
    setLines([...lines, { key: nextKey, productId: first.id, quantityKg: qty, unitPrice: tierPrice(first.id, qty) }]);
    setNextKey(nextKey + 1);
  };

  const update = (key: number, patch: Partial<Line>, repriced = false) =>
    setLines(
      lines.map((l) => {
        if (l.key !== key) return l;
        const next = { ...l, ...patch };
        return repriced ? { ...next, unitPrice: tierPrice(next.productId, next.quantityKg) } : next;
      }),
    );

  const subtotal = lines.reduce((a, l) => a + l.quantityKg * l.unitPrice, 0);
  const total = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <div>
      <input type="hidden" name="items" value={JSON.stringify(lines.map(({ productId, quantityKg, unitPrice }) => ({ productId, quantityKg, unitPrice })))} />
      <input type="hidden" name="discount" value={discount} />
      <input type="hidden" name="deliveryFee" value={deliveryFee} />

      <div className="space-y-3">
        {lines.map((l) => {
          const p = byId.get(l.productId);
          return (
            <div key={l.key} className="grid gap-3 rounded-xl border border-navy/10 p-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-muted">Product</span>
                <select
                  value={l.productId}
                  onChange={(e) => update(l.key, { productId: Number(e.target.value) }, true)}
                  className="w-full rounded-lg border border-navy/12 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                >
                  {products.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.sku})
                    </option>
                  ))}
                </select>
                {p && (
                  <span className={`mt-1 block text-xs ${p.stockKg < l.quantityKg ? "font-semibold text-amber-700" : "text-muted"}`}>
                    In stock: {p.stockKg} kg {p.stockKg < l.quantityKg && "· not enough stock (will be backordered)"}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-muted">Quantity (kg)</span>
                <input
                  type="number"
                  min={1}
                  value={l.quantityKg || ""}
                  onChange={(e) => update(l.key, { quantityKg: Math.max(0, Number(e.target.value)) }, true)}
                  className="w-full rounded-lg border border-navy/12 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-muted">Unit price (Rs/kg)</span>
                <input
                  type="number"
                  min={0}
                  value={l.unitPrice}
                  onChange={(e) => update(l.key, { unitPrice: Math.max(0, Number(e.target.value)) })}
                  className="w-full rounded-lg border border-navy/12 px-3 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </label>
              <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                <span className="text-sm font-extrabold text-navy sm:block sm:pb-2">{formatPKR(l.quantityKg * l.unitPrice)}</span>
                <button
                  type="button"
                  onClick={() => setLines(lines.filter((x) => x.key !== l.key))}
                  aria-label="Remove line"
                  className="grid size-9 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addLine}
        disabled={products.length === 0}
        className="mt-3 flex items-center gap-1.5 rounded-xl border border-dashed border-navy/20 px-4 py-2.5 text-sm font-bold text-navy hover:border-brand hover:bg-brand-50"
      >
        <Plus className="size-4" /> Add product
      </button>

      <div className="mt-5 ml-auto max-w-sm space-y-2 rounded-xl bg-mist p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="font-bold text-navy">{formatPKR(subtotal)}</span>
        </div>
        <label className="flex items-center justify-between gap-3">
          <span className="text-muted">Discount (Rs)</span>
          <input type="number" min={0} value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))} className="w-32 rounded-lg border border-navy/12 bg-white px-2 py-1 text-right text-sm" />
        </label>
        <label className="flex items-center justify-between gap-3">
          <span className="text-muted">Delivery fee (Rs)</span>
          <input type="number" min={0} value={deliveryFee} onChange={(e) => setDeliveryFee(Math.max(0, Number(e.target.value)))} className="w-32 rounded-lg border border-navy/12 bg-white px-2 py-1 text-right text-sm" />
        </label>
        <div className="flex justify-between border-t border-navy/10 pt-2 text-base">
          <span className="font-bold text-navy">Total</span>
          <span className="font-extrabold text-navy">{formatPKR(total)}</span>
        </div>
      </div>
    </div>
  );
}
