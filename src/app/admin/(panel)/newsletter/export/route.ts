import { cookies } from "next/headers";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

/** Download all newsletter subscribers as CSV (admin only). */
export async function GET() {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const rows = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    // Neutralise spreadsheet formula injection and escape quotes
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const csv = [
    ["email", "name", "status", "source", "subscribed_at"].join(","),
    ...rows.map((r) => [r.email, r.name, r.status, r.source, r.createdAt.toISOString()].map(esc).join(",")),
  ].join("\n");

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="soapbase-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
