import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { ProductWithCategory } from "@/db/schema";
import { formatPKR } from "@/lib/utils";
import { SoapBlock } from "@/components/shared/soap-block";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const color = product.color ?? product.category.color;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="spotlight group flex h-full flex-col overflow-hidden rounded-3xl border border-navy/8 bg-white shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-brand/30 hover:shadow-lift"
    >
      {/* Visual */}
      <div
        className="relative flex aspect-4/3 items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${color}66 0%, #f1f4f2 70%)`,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.6)_50%,transparent_70%)] bg-size-[250%_100%] opacity-0 transition-opacity duration-500 group-hover:animate-shimmer group-hover:opacity-100" />
        <SoapBlock
          color={color}
          translucent={product.category.translucent}
          className="w-[62%] transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:scale-105 group-hover:-rotate-3"
        />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {product.badge && (
            <span className="rounded-full bg-navy px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
              {product.badge}
            </span>
          )}
        </div>
        <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-navy backdrop-blur">
          <span className={`size-1.5 rounded-full ${product.inStock ? "bg-brand" : "bg-amber-500"}`} />
          {product.inStock ? "In stock" : "On order"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold tracking-wider text-brand uppercase">{product.category.name}</p>
          <span className="flex items-center gap-1 text-xs font-semibold text-navy">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="mt-2 text-lg leading-snug font-extrabold text-navy transition-colors group-hover:text-brand-600">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{product.shortDescription}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Wholesale from</p>
            <p className="text-xl font-extrabold text-navy">
              {formatPKR(product.pricePerKg)}
              <span className="text-sm font-semibold text-muted">/kg</span>
            </p>
            <p className="mt-0.5 text-xs text-muted">MOQ {product.moq} kg</p>
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-navy transition-all duration-500 group-hover:rotate-45 group-hover:bg-brand group-hover:text-white">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
