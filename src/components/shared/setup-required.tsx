import Image from "next/image";
import { Database, Terminal } from "lucide-react";

/** Friendly screen shown when the app has no database configured yet (fresh clone). */
export function SetupRequired({ missing, area = "website" }: { missing: string[]; area?: "website" | "admin panel" }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-navy/8 bg-white p-6 shadow-lift sm:p-10">
        <div className="flex items-center gap-3">
          <Image src="/images/logo-mark.png" alt="" width={478} height={555} sizes="44px" className="h-11 w-auto" priority />
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">Setup required</p>
            <h1 className="text-2xl font-extrabold text-navy">Connect your Supabase database</h1>
          </div>
        </div>

        <p className="mt-5 text-muted">
          The {area} can&apos;t load yet because these settings are missing from <code className="rounded bg-mist px-1.5 py-0.5 text-sm text-navy">.env</code>:
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {missing.map((m) => (
            <li key={m} className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 font-mono text-sm font-bold text-red-700">
              <Database className="size-4" /> {m}
            </li>
          ))}
        </ul>

        <ol className="mt-6 space-y-4 text-sm text-ink">
          <li className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy text-xs font-extrabold text-white">1</span>
            <div className="min-w-0">
              <p className="font-bold text-navy">Copy your connection string</p>
              <p className="mt-0.5 text-muted">
                Supabase dashboard → your project → <strong>Connect</strong> → <strong>Transaction pooler</strong> (port 6543). Replace <code>[YOUR-PASSWORD]</code> with your database password.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy text-xs font-extrabold text-white">2</span>
            <div className="min-w-0">
              <p className="font-bold text-navy">Paste it into <code>.env</code></p>
              <pre className="mt-1.5 overflow-x-auto rounded-xl bg-navy-900 p-3 text-xs text-white/90">DATABASE_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-xx.pooler.supabase.com:6543/postgres{"\n"}NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co{"\n"}SUPABASE_SERVICE_ROLE_KEY=…</pre>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy text-xs font-extrabold text-white">3</span>
            <div className="min-w-0">
              <p className="font-bold text-navy">Create the tables and sample data, then restart</p>
              <div className="mt-1.5 flex items-start gap-2 overflow-x-auto rounded-xl bg-navy-900 p-3 font-mono text-xs text-white/90">
                <Terminal className="mt-px size-4 shrink-0 text-brand-400" />
                <span>
                  npm run setup
                  <br />
                  npm run dev
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted">Stop the running dev server (Ctrl + C) before running setup, then start it again.</p>
            </div>
          </li>
        </ol>
        <div className="mt-6 rounded-2xl border border-brand/20 bg-brand-50 p-4 text-sm">
          <p className="font-bold text-navy">No Supabase account yet?</p>
          <p className="mt-1 text-muted">
            Use the built-in local dummy database: set <code className="text-navy">DATABASE_URL=postgresql://postgres:postgres@localhost:54329/soapbase</code> in{" "}
            <code className="text-navy">.env</code>, stop the dev server and run <code className="font-bold text-navy">npm run dev:local</code>.
          </p>
        </div>
        <p className="mt-4 text-xs text-muted">Full instructions are in README.md → Quick start.</p>
      </div>
    </main>
  );
}
