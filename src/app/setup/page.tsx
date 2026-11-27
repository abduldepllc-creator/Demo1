import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { missingSetup } from "@/config/env";
import { SetupRequired } from "@/components/shared/setup-required";

export const metadata: Metadata = {
  title: "Setup required",
  robots: { index: false, follow: false },
};

/**
 * Shown on a fresh clone before Supabase credentials are added.
 * proxy.ts redirects every page here while DATABASE_URL is missing.
 */
export default function SetupPage() {
  const missing = missingSetup();
  if (missing.length === 0) redirect("/");
  return <SetupRequired missing={missing} />;
}
