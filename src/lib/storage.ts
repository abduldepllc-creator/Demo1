import "server-only";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { env, storageConfigured } from "@/config/env";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function client() {
  if (!storageConfigured) {
    throw new Error(
      "Image storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env and run `npm run storage:setup`.",
    );
  }
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export function validateImage(file: File) {
  if (!ALLOWED[file.type]) return `${file.name}: only JPG, PNG, WebP or AVIF images are allowed.`;
  if (file.size > MAX_BYTES) return `${file.name}: image must be 5 MB or smaller.`;
  return null;
}

/** Upload an image to Supabase Storage and return its public URL. */
export async function uploadImage(file: File, folder: "products" | "categories") {
  const problem = validateImage(file);
  if (problem) throw new Error(problem);
  const supabase = client();
  const path = `${folder}/${new Date().getFullYear()}/${randomUUID()}.${ALLOWED[file.type]}`;
  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Delete images previously uploaded to our bucket. Other URLs are ignored. Never throws. */
export async function deleteImages(urls: string[]) {
  if (!storageConfigured || urls.length === 0) return;
  const marker = `/storage/v1/object/public/${env.SUPABASE_STORAGE_BUCKET}/`;
  const paths = urls.map((u) => (u.includes(marker) ? u.split(marker)[1] : null)).filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;
  try {
    await client().storage.from(env.SUPABASE_STORAGE_BUCKET).remove(paths);
  } catch (err) {
    console.error("Failed to delete images", err);
  }
}
