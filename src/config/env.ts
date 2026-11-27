import "server-only";
import { z } from "zod";

// Never throws at import time: a missing DATABASE_URL shows a friendly "Setup required"
// screen (see <SetupRequired />) instead of crashing every page.
const envSchema = z.object({
  DATABASE_URL: z.string().optional().default(""),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional().default(""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  SUPABASE_STORAGE_BUCKET: z.string().optional().default("soapbase-images"),
  ADMIN_USERNAME: z.string().min(1).default("admin"),
  ADMIN_PASSWORD: z.string().min(1).default("admin"),
  ADMIN_SESSION_SECRET: z.string().optional().default(""),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);

export const databaseConfigured = /^postgres(ql)?:\/\//.test(env.DATABASE_URL.trim());

export const storageConfigured = Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);

/** Without Supabase keys, development saves uploads to public/uploads/ (never used in production). */
export const localStorageMode = !storageConfigured && env.NODE_ENV === "development";

export const imageUploadsEnabled = storageConfigured || localStorageMode;

/** Names of required settings that are missing (values are never exposed). */
export function missingSetup() {
  const missing: string[] = [];
  if (!databaseConfigured) missing.push("DATABASE_URL");
  return missing;
}
