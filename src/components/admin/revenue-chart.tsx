"use client";

import { useState } from "react";
import { formatPKR } from "@/lib/utils";

type Point = { label: string; revenue: number; orders: number };

const W = 640;
const H = 240;
const PAD = { top: 16, right: 8, bottom: 28, left: 56 };
const BAR = 24; // max bar thickness

function niceMax(v: number) {
  if (v <= 0) return 1000;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function compact(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 ? 1 : 0)}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return String(v);
}

/** Single-series monthly revenue column chart (brand green, validated ≥3:1 on white). */
export function RevenueChart({ data }: { data: Point[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.revenue)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const band = plotW / data.length;
  const barW = Math.min(BAR, band * 0.55);
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH;

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Revenue by month, last six months">
          {/* Grid + y-axis labels (recessive) */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#0d2c50" strokeOpacity={t === 0 ? 0.25 : 0.07} />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill="#5b6b7e">
                {compact(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const cx = PAD.left + band * i + band / 2;
            const top = y(d.revenue);
            const h = PAD.top + plotH - top;
            const r = Math.min(4, h);
            const x0 = cx - barW / 2;
            const x1 = cx + barW / 2;
            const base = PAD.top + plotH;
            // Rounded data-end (top), square at the baseline
            const path = h > 0 ? `M${x0},${base} V${top + r} Q${x0},${top} ${x0 + r},${top} H${x1 - r} Q${x1},${top} ${x1},${top + r} V${base} Z` : "";
            const isActive = active === i;
            return (
              <g key={d.label}>
                {path && <path d={path} fill="#299d36" opacity={active === null || isActive ? 1 : 0.55} className="transition-opacity" />}
                <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill={isActive ? "#0d2c50" : "#5b6b7e"} fontWeight={isActive ? 700 : 400}>
                  {d.label}
                </text>
                {/* Hit target: the whole column band (bigger than the mark) */}
                <rect
                  x={PAD.left + band * i}
                  y={PAD.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`${d.label}: ${formatPKR(d.revenue)}, ${d.orders} orders`}
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="cursor-pointer outline-none"
                />
              </g>
            );
          })}
        </svg>

        {active !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-navy/10 bg-white px-3 py-2 text-xs shadow-lift"
            style={{
              left: `${((PAD.left + band * active + band / 2) / W) * 100}%`,
              top: `${(Math.max(y(data[active].revenue), PAD.top + 20) / H) * 100}%`,
            }}
          >
            <p className="text-sm font-extrabold whitespace-nowrap text-navy tabular-nums">{formatPKR(data[active].revenue)}</p>
            <p className="flex items-center gap-1.5 whitespace-nowrap text-muted">
              <span className="h-0.5 w-3 rounded-full bg-brand" />
              {data[active].label} · {data[active].orders} orders
            </p>
          </div>
        )}
      </div>

      <details className="mt-2 text-sm">
        <summary className="cursor-pointer font-semibold text-muted hover:text-navy">View as table</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr className="text-xs text-muted uppercase">
              <th className="py-1 font-bold">Month</th>
              <th className="py-1 text-right font-bold">Orders</th>
              <th className="py-1 text-right font-bold">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label} className="border-t border-navy/5">
                <td className="py-1.5">{d.label}</td>
                <td className="py-1.5 text-right tabular-nums">{d.orders}</td>
                <td className="py-1.5 text-right font-semibold tabular-nums">{formatPKR(d.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
