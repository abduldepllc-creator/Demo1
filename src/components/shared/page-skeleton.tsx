import { BrandLoader } from "./brand-loader";

/**
 * Placeholder shown while URL-dependent content (product, category, guide) streams in.
 * Matches the navy page banner + content layout so the page doesn't jump, with
 * shimmering blocks and the branded loader.
 */
export function PageSkeleton({ variant = "grid" }: { variant?: "grid" | "detail" | "article" }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <section className="relative overflow-hidden bg-navy pt-36 pb-20 sm:pt-40 sm:pb-24">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0d2c50_0%,#0a2341_100%)]" />
        <div className="container-x relative flex items-center justify-between gap-8">
          <div className="w-full space-y-5">
            <div className="skeleton-dark h-4 w-48 rounded-full" />
            <div className="skeleton-dark h-12 w-full max-w-xl rounded-2xl sm:h-14" />
            <div className="skeleton-dark h-5 w-full max-w-md rounded-full" />
          </div>
          <BrandLoader tone="dark" size="md" label="" className="hidden shrink-0 lg:flex" />
        </div>
      </section>

      <div className="container-x py-12">
        <BrandLoader size="sm" label="Loading" className="mb-10 lg:hidden" />
        {variant === "detail" && (
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="skeleton aspect-square rounded-4xl" />
            <div className="space-y-4">
              <div className="skeleton h-6 w-40 rounded-full" />
              <div className="skeleton h-24 rounded-3xl" style={{ animationDelay: "0.1s" }} />
              <div className="skeleton h-28 rounded-3xl" style={{ animationDelay: "0.2s" }} />
              <div className="skeleton h-80 rounded-3xl" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
        {variant === "article" && (
          <div className="mx-auto max-w-3xl space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-5 rounded-full" style={{ width: `${70 + ((i * 13) % 30)}%`, animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        )}
        {variant === "grid" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-105 rounded-3xl" style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
