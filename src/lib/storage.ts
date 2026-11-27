import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { env, localStorageMode, storageConfigured } from "@/config/env";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Local development uploads live here and are served as /uploads/... */
const LOCAL_ROOT = path.join(process.cwd(), "public", "uploads");
const LOCAL_PREFIX = "/uploads/";

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

/**
 * Upload an image and return its public URL.
 * Supabase Storage when configured; otherwise (development only) public/uploads/.
 */
export async function uploadImage(file: File, folder: "products" | "categories") {
  const problem = validateImage(file);
  if (problem) throw new Error(problem);
  const name = `${randomUUID()}.${ALLOWED[file.type]}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  if (!storageConfigured && localStorageMode) {
    const dir = path.join(LOCAL_ROOT, folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
    return `${LOCAL_PREFIX}${folder}/${name}`;
  }

  const supabase = client();
  const objectPath = `${folder}/${new Date().getFullYear()}/${name}`;
  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(objectPath, bytes, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
}

/** Delete images we uploaded (Supabase bucket or local dev folder). Other URLs are ignored. Never throws. */
export async function deleteImages(urls: string[]) {
  if (urls.length === 0) return;

  // Local development uploads
  for (const u of urls.filter((x) => x.startsWith(LOCAL_PREFIX))) {
    const file = path.resolve(LOCAL_ROOT, u.slice(LOCAL_PREFIX.length));
    if (!file.startsWith(LOCAL_ROOT + path.sep)) continue; // never leave the uploads folder
    await unlink(file).catch(() => {});
  }

  if (!storageConfigured) return;
  const marker = `/storage/v1/object/public/${env.SUPABASE_STORAGE_BUCKET}/`;
  const paths = urls.map((u) => (u.includes(marker) ? u.split(marker)[1] : null)).filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;
  try {
    await client().storage.from(env.SUPABASE_STORAGE_BUCKET).remove(paths);
  } catch (err) {
    console.error("Failed to delete images", err);
  }
}
