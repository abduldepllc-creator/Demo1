/**
 * Database client for CLI scripts (migrate, seed, setup).
 * The Next.js app uses src/db/index.ts instead (that one is server-only).
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";

export function createScriptDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("\n✖ DATABASE_URL is not set. Copy .env.example to .env and add your Supabase connection string.\n");
    process.exit(1);
  }
  const client = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
  return { db: drizzle(client, { schema }), client };
}
