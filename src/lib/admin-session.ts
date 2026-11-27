import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "./auth";

/**
 * Verify the admin session for Server Components and Server Actions.
 * proxy.ts already redirects anonymous visitors, but every action re-checks
 * (defence in depth: actions are POST endpoints that can be called directly).
 */
export async function requireAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) redirect("/admin/login");
  return session;
}
