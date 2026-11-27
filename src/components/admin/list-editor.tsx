"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { CategoryBenefit } from "@/db/schema";

/** Edit a list of short strings (features, pack sizes, applications). Submitted as JSON. */
export function ListEditor({ name, defaultValue = [], placeholder }: { name: string; defaultValue?: string[]; placeholder?: string }) {
  const [items, setItems] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (v && !items.includes(v)) setItems([...items, v]);
    setDraft("");
  };

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      {items.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-1 rounded-lg bg-navy-50 py-1 pr-1 pl-3 text-sm font-semibold text-navy">
              {item}
              <button type="button" onClick={() => setItems(items.filter((i) => i !== item))} aria-label={`Remove ${item}`} className="grid size-6 place-items-center rounded-md hover:bg-white">
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-xl border border-navy/12 px-3.5 py-2.5 text-sm focus:border-brand focus:ring-4 focus:ring-brand/15 focus:outline-none"
        />
        <button type="button" onClick={add} className="flex items-center gap-1 rounded-xl border border-navy/15 px-3 text-sm font-bold text-navy hover:bg-mist">
          <Plus className="size-4" /> Add
        </button>
      </div>
    </div>
  );
}

/** Edit category benefit cards (title + text pairs). Submitted as JSON. */
export function BenefitEditor({ name, defaultValue = [] }: { name: string; defaultValue?: CategoryBenefit[] }) {
  const [items, setItems] = useState<CategoryBenefit[]>(defaultValue.length ? defaultValue : [{ title: "", text: "" }]);
  const update = (i: number, key: keyof CategoryBenefit, value: string) => setItems(items.map((it, j) => (j === i ? { ...it, [key]: value } : it)));

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify(items.filter((b) => b.title.trim()))} />
      {items.map((b, i) => (
        <div key={i} className="flex gap-2">
          <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_2fr]">
            <input value={b.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Benefit title" className="rounded-xl border border-navy/12 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none" />
            <input value={b.text} onChange={(e) => update(i, "text", e.target.value)} placeholder="Short explanation" className="rounded-xl border border-navy/12 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none" />
          </div>
          <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} aria-label="Remove benefit" className="grid size-10 shrink-0 place-items-center self-start rounded-xl text-muted hover:bg-red-50 hover:text-red-600">
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setItems([...items, { title: "", text: "" }])} className="flex items-center gap-1 rounded-xl border border-navy/15 px-3 py-2 text-sm font-bold text-navy hover:bg-mist">
        <Plus className="size-4" /> Add benefit
      </button>
    </div>
  );
}
