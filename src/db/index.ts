import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/config/env";
import * as schema from "./schema";

// Reuse one connection pool across hot reloads in development.
const globalForDb = globalThis as unknown as { pgClient?: ReturnType<typeof postgres> };

const client =
  globalForDb.pgClient ??
  postgres(env.DATABASE_URL, {
    // Supabase's transaction pooler (port 6543) does not support prepared statements.
    prepare: false,
    max: env.NODE_ENV === "production" ? 10 : 5,
    idle_timeout: 20,
  });

if (env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
export type DB = typeof db;
