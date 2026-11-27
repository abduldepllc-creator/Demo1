"use client";

import { useActionState, useState } from "react";
import { adjustStock } from "@/actions/admin/stock";
import { Field, FormError, Input, Select, SubmitButton, type ActionState } from "./form";

export function StockAdjustForm({
  products,
  defaultProductId,
}: {
  products: { id: number; name: string; sku: string; stockKg: number }[];
  defaultProductId?: number;
}) {
  const [state, action] = useActionState(adjustStock, {} as ActionState);
  const [productId, setProductId] = useState(defaultProductId ?? products[0]?.id ?? 0);
  const [type, setType] = useState<"in" | "out" | "adjustment">("in");
  const current = products.find((p) => p.id === productId);
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4 p-5" noValidate>
      <Field label="Product" name="productId" required error={e.productId}>
        <Select name="productId" value={productId} onChange={(ev) => setProductId(Number(ev.target.value))}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
          ))}
        </Select>
      </Field>
      {current && (
        <p className="rounded-xl bg-mist px-3 py-2 text-sm">
          Current stock: <span className="font-extrabold text-navy">{current.stockKg} kg</span>
        </p>
      )}
      <fieldset>
        <legend className="mb-1.5 text-sm font-bold text-navy">Movement</legend>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-mist p-1">
          {(
            [
              ["in", "Receive"],
              ["out", "Remove"],
              ["adjustment", "Set count"],
            ] as const
          ).map(([v, label]) => (
            <label key={v} className={`cursor-pointer rounded-lg px-2 py-2 text-center text-sm font-bold transition-colors ${type === v ? "bg-white text-navy shadow-sm" : "text-muted"}`}>
              <input type="radio" name="type" value={v} checked={type === v} onChange={() => setType(v)} className="sr-only" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <Field
        label={type === "adjustment" ? "Counted stock (kg)" : "Quantity (kg)"}
        name="quantityKg"
        required
        hint={type === "adjustment" ? "Sets stock to this exact amount after a physical count" : undefined}
        error={e.quantityKg}
      >
        <Input name="quantityKg" type="number" min={0} inputMode="numeric" />
      </Field>
      <Field label="Reason / reference" name="reason" error={e.reason}>
        <Input name="reason" placeholder={type === "in" ? "e.g. Production batch #214" : type === "out" ? "e.g. Damaged cartons" : "e.g. Monthly stock count"} />
      </Field>
      <FormError state={state} />
      <SubmitButton className="w-full">Save movement</SubmitButton>
    </form>
  );
}
