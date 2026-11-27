import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SoapBlock } from "@/components/shared/soap-block";
import { formatPKR } from "@/lib/utils";

type Props = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  translucent: boolean;
  productCount: number;
  fromPrice: number | null;
};

export function CategoryCard(c: Props) {
  return (
    <Link
      href={`/categories/${c.slug}`}
      className="spotlight group flex h-full flex-col overflow-hidden rounded-3xl border border-navy/8 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift sm:p-7"
    >
      <div
        className="absolute -top-24 -right-24 size-64 rounded-full opacity-60 blur-2xl transition-all duration-700 group-hover:scale-125 group-hover:opacity-90"
        style={{ background: c.color }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-navy">
          {c.productCount} products
        </span>
        <span className="grid size-10 place-items-center rounded-full border border-navy/10 bg-white text-navy transition-all duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
          <ArrowRight className="size-4 transition-transform duration-500 group-hover:-rotate-45" />
        </span>
      </div>

      <div className="relative mx-auto my-6 w-[70%] max-w-60">
        <SoapBlock
          color={c.color}
          translucent={c.translucent}
          className="transition-transform duration-700 ease-out group-hover:-translate-y-4 group-hover:scale-110 group-hover:rotate-[-4deg]"
        />
      </div>

      <div className="relative mt-auto">
        <h3 className="text-xl font-extrabold text-navy">{c.name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand">{c.tagline}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{c.description}</p>
        {c.fromPrice && (
          <p className="mt-4 border-t border-navy/8 pt-4 text-sm text-muted">
            Wholesale from <span className="font-extrabold text-navy">{formatPKR(c.fromPrice)}/kg</span>
          </p>
        )}
      </div>
    </Link>
  );
}
