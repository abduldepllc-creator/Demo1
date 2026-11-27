import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { databaseConfigured, env } from "@/config/env";
import * as schema from "./schema";

function createDb() {
  const client = postgres(env.DATABASE_URL, {
    // Supabase's transaction pooler (port 6543) does not support prepared statements.
    prepare: false,
    max: env.NODE_ENV === "production" ? 10 : 5,
    idle_timeout: 20,
  });
  return drizzle(client, { schema });
}

export type DB = ReturnType<typeof createDb>;

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set. Add your Supabase connection string to .env, then run `npm run setup`.");
    this.name = "DatabaseNotConfiguredError";
  }
}

// Reuse one connection pool across hot reloads in development.
const globalForDb = globalThis as unknown as { soapbaseDb?: DB };

function getDb(): DB {
  if (!databaseConfigured) throw new DatabaseNotConfiguredError();
  if (!globalForDb.soapbaseDb) globalForDb.soapbaseDb = createDb();
  return globalForDb.soapbaseDb;
}

/**
 * Lazily-connected database. Importing this module never throws, so pages can
 * render a "Setup required" screen when DATABASE_URL is missing. The first query
 * throws a clear DatabaseNotConfiguredError instead.
 */
export const db = new Proxy({} as DB, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
