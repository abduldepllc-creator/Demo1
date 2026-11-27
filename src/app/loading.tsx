import { BrandLoader } from "@/components/shared/brand-loader";

/** App start / route loading screen: branded, CSS-only, on the brand navy. */
export default function Loading() {
  return (
    <div className="relative isolate flex min-h-[80vh] flex-1 items-center justify-center overflow-hidden bg-navy px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_50%_45%,rgba(41,157,54,0.28),transparent_70%)]" />
      <div className="grid-pattern absolute inset-0 -z-10" />
      <BrandLoader tone="dark" size="lg" label="Loading SoapBase" />
    </div>
  );
}
