/**
 * Local "dummy" database for development without Supabase.
 * Runs a real PostgreSQL 17 server (same engine as Supabase) from node_modules,
 * storing data in .local-db/ (git-ignored).
 *
 *   npm run db:local   → start the database only (keep this terminal open)
 *   npm run dev:local  → start the database AND the Next.js dev server together
 *
 * On first start it creates the tables and loads the sample data automatically.
 * Switch to Supabase later by putting your Supabase DATABASE_URL in .env.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

export const LOCAL_PORT = 54329;
export const LOCAL_DATABASE_URL = `postgresql://postgres:postgres@localhost:${LOCAL_PORT}/soapbase`;
const DATA_DIR = path.resolve(".local-db");
const withDev = process.argv.includes("--with-dev");

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: "postgres",
    password: "postgres",
    port: LOCAL_PORT,
    persistent: true,
    onLog: () => {},
  });

  const fresh = !existsSync(path.join(DATA_DIR, "PG_VERSION"));
  if (fresh) {
    console.log("• Creating local database in .local-db/ (first run)…");
    await pg.initialise();
  }
  await pg.start();
  try {
    await pg.createDatabase("soapbase");
  } catch {
    // already exists
  }

  // Point the scripts (and the dev server) at the local database.
  process.env.DATABASE_URL = LOCAL_DATABASE_URL;
  const { runMigrations } = await import("./migrate");
  const { seed } = await import("../seed/index");
  await runMigrations();
  await seed();

  console.log(`\n✅ Local database running at ${LOCAL_DATABASE_URL}`);

  let child: ReturnType<typeof spawn> | null = null;
  if (withDev) {
    console.log("• Starting Next.js dev server…\n");
    child = spawn("npx", ["next", "dev"], {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, DATABASE_URL: LOCAL_DATABASE_URL },
    });
    child.on("exit", () => shutdown());
  } else {
    console.log("   Keep this terminal open, then run `npm run dev` in another one.");
    console.log("   (DATABASE_URL in .env must be the URL above.)  Press Ctrl+C to stop.\n");
  }

  let stopping = false;
  async function shutdown() {
    if (stopping) return;
    stopping = true;
    console.log("\n• Stopping local database…");
    if (child && !child.killed) child.kill();
    await pg.stop().catch(() => {});
    process.exit(0);
  }
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Keep the process alive while the database runs.
  setInterval(() => {}, 1 << 30);
}

main().catch((err) => {
  console.error("✖ Could not start the local database:", err?.message ?? err);
  console.error("  If port 54329 is busy, another copy may already be running.");
  process.exit(1);
});
