/**
 * Placeholder shown while URL-dependent content (product, category, guide) streams in.
 * It matches the navy page banner + content layout, so the page doesn't jump when real content arrives.
 */
export function PageSkeleton({ variant = "grid" }: { variant?: "grid" | "detail" | "article" }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <section className="relative overflow-hidden bg-navy pt-36 pb-20 sm:pt-40 sm:pb-24">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0d2c50_0%,#0a2341_100%)]" />
        <div className="container-x relative space-y-5">
          <div className="h-4 w-48 animate-pulse rounded-full bg-white/10" />
          <div className="h-12 w-full max-w-xl animate-pulse rounded-2xl bg-white/10 sm:h-14" />
          <div className="h-5 w-full max-w-md animate-pulse rounded-full bg-white/10" />
        </div>
      </section>

      <div className="container-x py-12">
        {variant === "detail" && (
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-4xl bg-mist" />
            <div className="space-y-4">
              <div className="h-6 w-40 animate-pulse rounded-full bg-mist" />
              <div className="h-24 animate-pulse rounded-3xl bg-mist" />
              <div className="h-28 animate-pulse rounded-3xl bg-mist" />
              <div className="h-80 animate-pulse rounded-3xl bg-mist" />
            </div>
          </div>
        )}
        {variant === "article" && (
          <div className="mx-auto max-w-3xl space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-5 animate-pulse rounded-full bg-mist" style={{ width: `${70 + ((i * 13) % 30)}%` }} />
            ))}
          </div>
        )}
        {variant === "grid" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-105 animate-pulse rounded-3xl bg-mist" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
