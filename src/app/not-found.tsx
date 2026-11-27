import Link from "next/link";
import { SoapBlock } from "@/components/shared/soap-block";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center bg-navy px-4 pt-28 pb-16 text-center">
      <div className="animate-float w-40 sm:w-52">
        <SoapBlock color="#cfeef5" translucent />
      </div>
      <p className="mt-6 text-7xl font-extrabold text-white sm:text-8xl">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-white">This page melted away</h1>
      <p className="mt-2 max-w-md text-white/70">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/products" className="btn btn-ghost-light">
          Browse products
        </Link>
      </div>
    </section>
  );
}
