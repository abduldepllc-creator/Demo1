import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Toast } from "@/components/admin/toast";
import { AdminPageLoading } from "@/components/admin/page-loading";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | SoapBase" },
  robots: { index: false, follow: false },
};

// Admin pages read the session cookie and live data on every request, so they opt out
// of instant-navigation validation (see Next.js docs: authentication-with-cache-components).
export const instant = false;

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      <Suspense fallback={<AdminPageLoading />}>{children}</Suspense>
      <Suspense>
        <Toast />
      </Suspense>
    </AdminShell>
  );
}
