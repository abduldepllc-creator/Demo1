/**
 * Admin session tokens: `<base64url(payload)>.<base64url(HMAC-SHA256)>`.
 * Uses Web Crypto only, so it works in proxy.ts and in server code alike.
 */

export const SESSION_COOKIE = "sb_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { u: string; exp: number };

const encoder = new TextEncoder();

function b64url(bytes: Uint8Array) {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/** Secret used to sign sessions. Falls back to a value derived from other secrets in dev. */
export function sessionSecret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set (run `npm run setup` to generate one).");
  }
  return `dev-only:${process.env.DATABASE_URL ?? ""}:${process.env.ADMIN_PASSWORD ?? ""}`;
}

async function hmac(data: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}

export async function signSession(username: string, secret = sessionSecret()) {
  const payload: SessionPayload = { u: username, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const body = b64url(encoder.encode(JSON.stringify(payload)));
  const sig = b64url(await hmac(body, secret));
  return `${body}.${sig}`;
}

export async function verifySession(token: string | undefined, secret = sessionSecret()): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const expected = await hmac(body, secret);
    const given = fromB64url(sig);
    if (given.length !== expected.length) return null;
    let diff = 0;
    for (let i = 0; i < given.length; i++) diff |= given[i] ^ expected[i];
    if (diff !== 0) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
