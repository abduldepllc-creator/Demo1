import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

const databaseConfigured = () => /^postgres(ql)?:\/\//.test((process.env.DATABASE_URL ?? "").trim());

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Fresh clone without Supabase credentials: send every page to the setup instructions
  // instead of letting pages crash on their first database query.
  if (!databaseConfigured()) {
    if (pathname === "/setup") return NextResponse.next();
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Database not configured. See /setup." }, { status: 503 });
    }
    return NextResponse.redirect(new URL("/setup", request.url));
  }

  // Database is configured: the setup page is no longer needed.
  if (pathname === "/setup") return NextResponse.redirect(new URL("/", request.url));

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Gate every /admin route behind a valid admin session.
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return session ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  if (!session) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  // Everything except static files and images (cheap check; admin auth only runs for /admin).
  matcher: ["/((?!_next/static|_next/image|images/|icon\\.png|favicon\\.ico).*)"],
};
