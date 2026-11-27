"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { uploadImages } from "@/actions/admin/uploads";
import { cn } from "@/lib/utils";

/**
 * Upload images to Supabase Storage and manage their order.
 * The current list is submitted with the parent form as a JSON hidden input.
 */
export function ImageUploader({
  name,
  folder,
  defaultValue = [],
  max = 8,
  storageReady,
}: {
  name: string;
  folder: "products" | "categories";
  defaultValue?: string[];
  max?: number;
  storageReady: boolean;
}) {
  const [images, setImages] = useState<string[]>(defaultValue);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const single = max === 1;

  const upload = (files: FileList | File[]) => {
    const list = Array.from(files).slice(0, Math.max(0, max - (single ? 0 : images.length)));
    if (list.length === 0) return;
    const fd = new FormData();
    list.forEach((f) => fd.append("files", f));
    start(async () => {
      const res = await uploadImages(folder, fd);
      setErrors(res.errors);
      if (res.urls.length) setImages((prev) => (single ? res.urls.slice(0, 1) : [...prev, ...res.urls].slice(0, max)));
    });
  };

  const move = (i: number, d: -1 | 1) =>
    setImages((prev) => {
      const next = [...prev];
      const j = i + d;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div>
      <input type="hidden" name={name} value={single ? (images[0] ?? "") : JSON.stringify(images)} />

      {images.length > 0 && (
        <ul className={cn("mb-3 grid gap-3", single ? "grid-cols-1 sm:max-w-xs" : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4")}>
          {images.map((src, i) => (
            <li key={src} className="group relative aspect-square overflow-hidden rounded-xl border border-navy/10 bg-mist">
              <Image src={src} alt="" fill sizes="200px" className="object-cover" />
              {!single && i === 0 && (
                <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-white">
                  <Star className="size-3 fill-current" /> Cover
                </span>
              )}
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                {!single && (
                  <span className="flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left" className="grid size-7 place-items-center rounded-lg bg-white/90 text-navy shadow disabled:opacity-40">
                      <ArrowLeft className="size-3.5" />
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Move right" className="grid size-7 place-items-center rounded-lg bg-white/90 text-navy shadow disabled:opacity-40">
                      <ArrowRight className="size-3.5" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((u) => u !== src))}
                  aria-label="Remove image"
                  className="ml-auto grid size-7 place-items-center rounded-lg bg-red-600 text-white shadow"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(single ? true : images.length < max) && (
        <button
          type="button"
          disabled={!storageReady || pending}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (storageReady) upload(e.dataTransfer.files);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors",
            dragging ? "border-brand bg-brand-50" : "border-navy/15 bg-mist/50 hover:border-brand/60",
            (!storageReady || pending) && "cursor-not-allowed opacity-70",
          )}
        >
          {pending ? <Loader2 className="size-6 animate-spin text-brand" /> : <ImagePlus className="size-6 text-brand" />}
          <span className="text-sm font-bold text-navy">
            {pending ? "Uploading…" : single && images.length ? "Replace image" : "Click or drag images here"}
          </span>
          <span className="text-xs text-muted">
            {storageReady ? `JPG, PNG, WebP or AVIF · max 5 MB${single ? "" : ` · up to ${max} images`}` : "Image storage is not configured. Add your Supabase keys to .env."}
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={!single}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) upload(e.target.files);
          e.target.value = "";
        }}
      />
      {errors.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs font-semibold text-red-600">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
