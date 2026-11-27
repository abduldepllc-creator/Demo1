import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Toast } from "@/components/admin/toast";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | SoapBase" },
  robots: { index: false, follow: false },
};

// Admin pages read the session cookie and live data on every request, so they opt out
// of instant-navigation validation (see Next.js docs: authentication-with-cache-components).
export const instant = false;

function PageLoading() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-9 w-56 animate-pulse rounded-xl bg-white" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      <Suspense fallback={<PageLoading />}>{children}</Suspense>
      <Suspense>
        <Toast />
      </Suspense>
    </AdminShell>
  );
}
