"use server";

import { requireAdmin } from "@/lib/admin-session";
import { uploadImage } from "@/lib/storage";

export type UploadResult = { urls: string[]; errors: string[] };

/** Upload one or more images to Supabase Storage (admin only). */
export async function uploadImages(folder: "products" | "categories", formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const urls: string[] = [];
  const errors: string[] = [];
  for (const file of files.slice(0, 10)) {
    try {
      urls.push(await uploadImage(file, folder));
    } catch (err) {
      errors.push(err instanceof Error ? err.message : `${file.name}: upload failed`);
    }
  }
  return { urls, errors };
}
