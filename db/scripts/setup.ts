/**
 * One-command project setup for a fresh clone:
 *   1. checks .env  2. generates an admin session secret  3. runs migrations
 *   4. seeds the catalogue (only if empty)  5. creates the Supabase Storage bucket
 *
 *   npm run setup
 */
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const ENV_FILE = ".env";

function ensureEnv() {
  if (!existsSync(ENV_FILE)) {
    if (existsSync(".env.example")) writeFileSync(ENV_FILE, readFileSync(".env.example", "utf8"));
    console.error("\n✖ No .env file found. A copy of .env.example was created as .env.");
    console.error("  Add your Supabase credentials to .env, then run `npm run setup` again.\n");
    process.exit(1);
  }

  let content = readFileSync(ENV_FILE, "utf8");
  const has = (key: string) => new RegExp(`^${key}=.+$`, "m").test(content);

  if (!has("ADMIN_SESSION_SECRET")) {
    const secret = randomBytes(32).toString("hex");
    content = /^ADMIN_SESSION_SECRET=.*$/m.test(content)
      ? content.replace(/^ADMIN_SESSION_SECRET=.*$/m, `ADMIN_SESSION_SECRET=${secret}`)
      : `${content.trimEnd()}\nADMIN_SESSION_SECRET=${secret}\n`;
    writeFileSync(ENV_FILE, content);
    console.log("✓ Generated ADMIN_SESSION_SECRET in .env");
  }

  // Load the (possibly updated) .env into process.env
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }

  if (!process.env.DATABASE_URL) {
    console.error("\n✖ DATABASE_URL is empty in .env — add your Supabase connection string and run again.\n");
    process.exit(1);
  }
}

async function main() {
  console.log("\n🧼 SoapBase.pk setup\n");
  ensureEnv();
  const { runMigrations } = await import("./migrate");
  const { seed } = await import("../seed/index");
  const { setupStorage } = await import("./storage");
  await runMigrations();
  await seed();
  await setupStorage();
  console.log("\n✅ Setup complete. Run `npm run dev` and open http://localhost:3000 (admin: /admin)\n");
}

main().catch((err) => {
  console.error("\n✖ Setup failed:", err?.message ?? err);
  process.exit(1);
});
