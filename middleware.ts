import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

function isAdminHost(host: string) {
  // local dev
  if (
    host.startsWith("admin.localtools.app") ||
    host.startsWith("admin.localhost")
  ) {
    return true;
  }

  // production
  if (host.startsWith("admin.")) {
    return true;
  }

  return false;
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  // ✅ MAIN APP → full skip
  if (!isAdminHost(host)) {
    return NextResponse.next();
  }

  const pathname = req.nextUrl.pathname;

  // ✅ login page always allowed
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map((c) => ({
            name: c.name,
            value: c.value,
          }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginUrl = new URL("/login", req.url);

  if (!user) {
    return NextResponse.redirect(loginUrl);
  }

  if (user.app_metadata?.role !== "admin") {
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
