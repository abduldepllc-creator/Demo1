"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What is the minimum order quantity?",
    a: "Our MOQ is 20–25 kg depending on the base. Volume discounts start at 100 kg, with up to 12% off on orders of 1 ton and above.",
  },
  {
    q: "Do you deliver across Pakistan?",
    a: "Yes. We dispatch to 60+ cities through trusted cargo partners. Orders are typically dispatched within 48–72 hours of payment confirmation.",
  },
  {
    q: "Can I get a sample before placing a bulk order?",
    a: "Absolutely. We offer 1 kg sample packs of any base so you can test clarity, lather and fragrance load before committing to bulk.",
  },
  {
    q: "Do you offer custom formulations or private labelling?",
    a: "Yes — for larger orders we can adjust clarity, hardness, colour, additives and packaging, and supply under your own brand label.",
  },
  {
    q: "How should soap base be stored?",
    a: "Keep it sealed in its original wrap in a cool, dry place away from direct sunlight. Most of our bases have an 18–24 month shelf life.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfer (IBFT), and for established customers we offer flexible credit terms on repeat orders.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-navy/8 rounded-3xl border border-navy/8 bg-white">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
            >
              <span className="font-bold text-navy sm:text-lg">{f.q}</span>
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-300",
                  isOpen ? "rotate-45 bg-brand text-white" : "bg-mist text-navy",
                )}
              >
                <Plus className="size-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 leading-relaxed text-muted sm:px-7">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
