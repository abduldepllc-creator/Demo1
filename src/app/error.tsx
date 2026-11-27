"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center bg-navy px-4 pt-28 pb-16 text-center">
      <h1 className="text-3xl font-extrabold text-white">Something went wrong</h1>
      <p className="mt-2 text-white/70">Please try again. If the problem continues, contact us on WhatsApp.</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">
        Try again
      </button>
    </section>
  );
}
