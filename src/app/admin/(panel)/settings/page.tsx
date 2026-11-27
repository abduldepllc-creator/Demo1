import type { Metadata } from "next";
import { sql } from "drizzle-orm";
import { createClient } from "@supabase/supabase-js";
import { AlertTriangle, CheckCircle2, Database, HardDrive, KeyRound, RefreshCw, XCircle } from "lucide-react";
import { db } from "@/db";
import { env, storageConfigured } from "@/config/env";
import { requireAdmin } from "@/lib/admin-session";
import { refreshWebsiteCache } from "@/actions/admin/settings";
import { Card, PageHeader } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/form";

export const metadata: Metadata = { title: "Settings" };

async function checkDatabase() {
  try {
    const started = Date.now();
    const [row] = await db.execute<{ version: string }>(sql`select version() as version`);
    return { ok: true, detail: `${String(row.version).split(" on ")[0]} · ${Date.now() - started} ms` };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : "Connection failed" };
  }
}

async function checkStorage() {
  if (!storageConfigured) return { ok: false, detail: "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set. Image uploads are disabled." };
  try {
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data, error } = await supabase.storage.getBucket(env.SUPABASE_STORAGE_BUCKET);
    if (error || !data) return { ok: false, detail: `Bucket "${env.SUPABASE_STORAGE_BUCKET}" not found. Run npm run storage:setup.` };
    return { ok: data.public, detail: data.public ? `Bucket "${data.name}" is public and ready` : `Bucket "${data.name}" is private. Run npm run storage:setup.` };
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : "Storage check failed" };
  }
}

function Status({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <div className="flex items-start gap-3">
      {ok ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" /> : <XCircle className="mt-0.5 size-5 shrink-0 text-red-600" />}
      <div className="min-w-0">
        <p className="font-bold text-navy">{label}</p>
        <p className="text-sm break-words text-muted">{detail}</p>
      </div>
    </div>
  );
}

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  const [database, storage] = await Promise.all([checkDatabase(), checkStorage()]);
  const defaultPassword = env.ADMIN_PASSWORD === "admin";
  const dbHost = (() => {
    try {
      return new URL(env.DATABASE_URL).host;
    } catch {
      return "unknown";
    }
  })();

  return (
    <>
      <PageHeader title="Settings" description="System status and admin account." />

      {defaultPassword && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p>
            <strong>You are using the temporary admin password.</strong> Before going live, set a strong <code className="rounded bg-white/70 px-1">ADMIN_PASSWORD</code> (and ideally a different <code className="rounded bg-white/70 px-1">ADMIN_USERNAME</code>) in your environment variables, then restart the app.
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title={<span className="flex items-center gap-2"><Database className="size-4" /> System status</span>}>
          <div className="space-y-4 p-5">
            <Status ok={database.ok} label="Database (Supabase Postgres)" detail={`${database.detail} · host ${dbHost}`} />
            <Status ok={storage.ok} label="Image storage (Supabase Storage)" detail={storage.detail} />
            <Status ok={Boolean(env.ADMIN_SESSION_SECRET)} label="Session secret" detail={env.ADMIN_SESSION_SECRET ? "ADMIN_SESSION_SECRET is set" : "Not set. Run npm run setup to generate one (required in production)."} />
          </div>
        </Card>

        <Card title={<span className="flex items-center gap-2"><KeyRound className="size-4" /> Admin account</span>}>
          <div className="space-y-3 p-5 text-sm">
            <p>Signed in as <strong className="text-navy">{session.u}</strong>. Sessions last 7 days.</p>
            <p className="text-muted">
              Credentials come from <code className="rounded bg-mist px-1">ADMIN_USERNAME</code> and <code className="rounded bg-mist px-1">ADMIN_PASSWORD</code> in <code className="rounded bg-mist px-1">.env</code> (or your hosting provider&apos;s environment settings). Changing them requires a restart.
            </p>
          </div>
        </Card>

        <Card title={<span className="flex items-center gap-2"><RefreshCw className="size-4" /> Website cache</span>}>
          <form action={refreshWebsiteCache} className="space-y-3 p-5 text-sm">
            <p className="text-muted">Saving products, categories, reviews or stock refreshes the public website automatically. Use this only if a change made directly in the database (e.g. in Supabase) isn&apos;t showing.</p>
            <SubmitButton variant="outline" pendingText="Refreshing…">Refresh website cache</SubmitButton>
          </form>
        </Card>

        <Card title={<span className="flex items-center gap-2"><HardDrive className="size-4" /> Maintenance commands</span>}>
          <dl className="space-y-3 p-5 text-sm">
            {[
              ["npm run setup", "Migrate, seed (if empty) and create the storage bucket"],
              ["npm run db:migrate", "Apply new migrations from db/migrations"],
              ["npm run db:generate", "Create a migration after changing src/db/schema"],
              ["npm run db:reset", "Wipe ALL data and reload the sample catalogue"],
              ["npm run storage:setup", "Create / repair the image bucket"],
            ].map(([cmd, text]) => (
              <div key={cmd}>
                <dt><code className="rounded bg-navy px-2 py-0.5 text-xs font-semibold text-white">{cmd}</code></dt>
                <dd className="mt-1 text-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </>
  );
}

// Reads the admin session and live data on every request (see layout.tsx).
export const instant = false;
