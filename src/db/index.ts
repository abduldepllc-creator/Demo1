import { drizzle } from "drizzle-orm/libsql";
import { createClient, type Client } from "@libsql/client";
import { env } from "@/config/env";
import * as schema from "./schema";

// Reuse the client across hot reloads in development.
const globalForDb = globalThis as unknown as { dbClient?: Client };

const client =
  globalForDb.dbClient ??
  createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN || undefined,
  });

if (env.NODE_ENV !== "production") globalForDb.dbClient = client;

export const db = drizzle(client, { schema });
export type DB = typeof db;
