/**
 * Create the public Supabase Storage bucket used for product & category images.
 *   npm run storage:setup
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

export async function setupStorage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "soapbase-images";

  if (!url || !key) {
    console.warn("! Skipping storage: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set (image uploads disabled).");
    return;
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data: existing, error: getError } = await supabase.storage.getBucket(bucket);
  if (existing && !getError) {
    if (!existing.public) await supabase.storage.updateBucket(bucket, { public: true });
    console.log(`✓ Storage bucket "${bucket}" is ready.`);
    return;
  }

  const { error } = await supabase.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  });
  if (error) throw new Error(`Could not create bucket "${bucket}": ${error.message}`);
  console.log(`✓ Created public storage bucket "${bucket}".`);
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("db/scripts/storage.ts")) {
  setupStorage().catch((err) => {
    console.error("✖ Storage setup failed:", err.message ?? err);
    process.exit(1);
  });
}
