import { Star } from "lucide-react";
import type { Review } from "@/db/schema";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { ReviewForm } from "./review-form";

function Stars({ value, className = "size-4" }: { value: number; className?: string }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${className} ${n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-navy/20"}`} />
      ))}
    </span>
  );
}

export function ProductReviews({
  productId,
  rating,
  count,
  reviews,
}: {
  productId: number;
  rating: number;
  count: number;
  reviews: Review[];
}) {
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }));

  return (
    <section id="reviews" className="cv-auto container-x scroll-mt-28 py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        <div className="space-y-6">
          <Reveal>
            <p className="eyebrow">Customer reviews</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy">What buyers say</h2>
            <div className="mt-6 flex items-center gap-5 rounded-3xl bg-mist p-6">
              <p className="text-5xl font-extrabold text-navy">{count ? rating.toFixed(1) : "–"}</p>
              <div>
                <Stars value={rating} className="size-5" />
                <p className="mt-1 text-sm text-muted">
                  {count ? `Based on ${count} review${count === 1 ? "" : "s"}` : "No reviews yet"}
                </p>
              </div>
            </div>
            {count > 0 && (
              <ul className="mt-4 space-y-2">
                {dist.map((d) => (
                  <li key={d.n} className="flex items-center gap-3 text-sm">
                    <span className="w-8 font-semibold text-navy">{d.n} ★</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-mist">
                      <span className="block h-full rounded-full bg-amber-400" style={{ width: `${reviews.length ? (d.c / reviews.length) * 100 : 0}%` }} />
                    </span>
                    <span className="w-6 text-right text-muted">{d.c}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          <ReviewForm productId={productId} />
        </div>

        <div>
          {reviews.length === 0 ? (
            <div className="flex h-full min-h-48 items-center justify-center rounded-3xl border border-dashed border-navy/15 p-8 text-center text-muted">
              Be the first to review this soap base.
            </div>
          ) : (
            <Stagger className="space-y-4">
              {reviews.map((r) => (
                <StaggerItem key={r.id}>
                  <article className="rounded-3xl border border-navy/8 bg-white p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Stars value={r.rating} />
                      <time className="text-xs text-muted" dateTime={r.createdAt.toISOString()}>
                        {r.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Karachi" })}
                      </time>
                    </div>
                    {r.title && <h3 className="mt-3 font-extrabold text-navy">{r.title}</h3>}
                    <p className="mt-2 leading-relaxed text-muted">{r.comment}</p>
                    <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm">
                      <span className="font-bold text-navy">{r.name}</span>
                      {(r.company || r.city) && (
                        <span className="text-muted">· {[r.company, r.city].filter(Boolean).join(", ")}</span>
                      )}
                    </p>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </section>
  );
}
