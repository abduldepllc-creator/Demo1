import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_80%_10%,rgba(41,157,54,0.35),transparent_60%),radial-gradient(40%_50%_at_10%_90%,rgba(56,120,220,0.3),transparent_60%)]" />
      <div className="grid-pattern absolute inset-0 -z-10" />

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/images/logo-mark.png" alt="" width={478} height={555} sizes="64px" className="h-16 w-auto" priority />
          <h1 className="mt-4 text-2xl font-extrabold text-white">
            Soap<span className="text-brand-400">Base</span> Admin
          </h1>
          <p className="mt-1 text-sm text-white/60">Sign in to manage your store</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lift sm:p-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-white/50">
          <Link href="/" className="hover:text-white">← Back to website</Link>
        </p>
      </div>
    </main>
  );
}
