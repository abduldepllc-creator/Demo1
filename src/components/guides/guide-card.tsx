import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { Guide } from "@/content/guides";
import { SoapBlock } from "@/components/shared/soap-block";

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="spotlight group flex h-full flex-col overflow-hidden rounded-3xl border border-navy/8 bg-white shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift"
    >
      <div
        className="relative flex aspect-video items-center justify-center overflow-hidden"
        style={{ background: `radial-gradient(circle at 30% 30%, ${guide.color}aa 0%, #f1f4f2 70%)` }}
      >
        <div className="dot-pattern absolute inset-0 opacity-60" />
        <SoapBlock
          color={guide.color}
          translucent={guide.translucent}
          className="relative w-[42%] transition-transform duration-700 group-hover:-translate-y-2 group-hover:-rotate-6"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold tracking-wide text-navy uppercase backdrop-blur">
          {guide.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-3 text-xs font-semibold text-muted">
          <span>{formatDate(guide.date)}</span>
          <span className="size-1 rounded-full bg-muted/50" />
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {guide.readMinutes} min read
          </span>
        </p>
        <h3 className="mt-3 text-lg leading-snug font-extrabold text-navy transition-colors group-hover:text-brand-600">
          {guide.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{guide.excerpt}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-bold text-brand">
          Read guide
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
