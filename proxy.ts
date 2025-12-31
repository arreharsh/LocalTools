import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  // Skip if not admin subdomain
  if (!host.startsWith("admin.")) {
    return NextResponse.next();
  }

  const pathname = req.nextUrl.pathname;

  // ✅ login page always allow
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
  // matcher rehne do broad,
  // host check upar hi skip kar dega
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
