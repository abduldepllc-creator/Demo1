import { BrandLoader } from "@/components/shared/brand-loader";

/** Admin loading state: branded loader + shimmering skeleton of a typical admin page. */
export function AdminPageLoading() {
  return (
    <div aria-busy="true" className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="skeleton-white h-9 w-48 rounded-xl sm:w-64" />
          <div className="skeleton-white h-4 w-64 max-w-full rounded-lg sm:w-96" />
        </div>
        <div className="skeleton-white h-10 w-36 rounded-xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-white h-28 rounded-2xl border border-navy/5" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>

      <div className="relative mt-6 overflow-hidden rounded-2xl border border-navy/8 bg-white">
        <div className="space-y-3 p-5 opacity-60">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton size-10 shrink-0 rounded-xl" style={{ animationDelay: `${i * 0.08}s` }} />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-1/2 rounded-md" style={{ animationDelay: `${i * 0.08}s` }} />
                <div className="skeleton h-3 w-1/3 rounded-md" style={{ animationDelay: `${i * 0.08}s` }} />
              </div>
              <div className="skeleton hidden h-6 w-20 rounded-full sm:block" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 grid place-items-center bg-white/40">
          <BrandLoader label="Loading" size="md" />
        </div>
      </div>
    </div>
  );
}
