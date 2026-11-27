"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/auth";

export type LoginState = { error?: string };

// Basic in-memory brute-force protection: 5 failed attempts per IP per 15 minutes.
const attempts = new Map<string, { count: number; until: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function safeNext(next: FormDataEntryValue | null) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/admin") && !n.startsWith("//") ? n : "/admin";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.count >= MAX_ATTEMPTS && entry.until > now) {
    const mins = Math.ceil((entry.until - now) / 60000);
    return { error: `Too many failed attempts. Try again in ${mins} minute${mins === 1 ? "" : "s"}.` };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "admin";

  const ok = safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
  if (!ok) {
    const fresh = !entry || entry.until <= now;
    attempts.set(ip, { count: fresh ? 1 : entry.count + 1, until: fresh ? now + WINDOW_MS : entry.until });
    return { error: "Invalid username or password." };
  }

  attempts.delete(ip);
  (await cookies()).set(SESSION_COOKIE, await signSession(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
