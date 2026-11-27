import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-session";
import { PageHeader } from "@/components/admin/ui";
import { CustomerForm } from "@/components/admin/customer-form";

export const metadata: Metadata = { title: "New customer" };

export default async function NewCustomerPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add customer" back={{ href: "/admin/customers", label: "Customers" }} />
      <div className="max-w-3xl">
        <CustomerForm />
      </div>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
