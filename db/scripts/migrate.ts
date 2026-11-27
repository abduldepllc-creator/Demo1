/**
 * Apply all SQL migrations in db/migrations to the database in DATABASE_URL.
 *   npm run db:migrate
 */
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { createScriptDb } from "../client";

export async function runMigrations() {
  const { db, client } = createScriptDb();
  try {
    console.log("• Applying migrations from db/migrations…");
    await migrate(db, { migrationsFolder: "db/migrations" });
    console.log("✓ Database schema is up to date.");
  } finally {
    await client.end();
  }
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("db/scripts/migrate.ts")) {
  runMigrations().catch((err) => {
    console.error("✖ Migration failed:", err);
    process.exit(1);
  });
}
