"use server";

import { requireAdmin } from "@/lib/admin-session";
import { redirectWithToast, refreshCatalog } from "@/lib/admin-utils";

/** Force the public website to reload catalogue data on the next visit. */
export async function refreshWebsiteCache() {
  await requireAdmin();
  refreshCatalog();
  redirectWithToast("/admin/settings", "Website cache refreshed");
}
