"use client";

import { Printer } from "lucide-react";
import { btn } from "./styles";

export function PrintButton({ label = "Print invoice" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={btn("outline")}>
      <Printer className="size-4" /> {label}
    </button>
  );
}
