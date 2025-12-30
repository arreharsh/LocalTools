// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';


interface Cookie {
  name: string;
  value: string;
}

interface CookieToSet extends Cookie {
  options?: Record<string, unknown>;
}

interface CookieOptions {
  [key: string]: unknown;
}

interface CookieWithOptions extends Cookie {
  options?: CookieOptions;
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): Cookie[] {
          // Explicitly req.cookies se get karo
          return req.cookies.getAll().map((c) => ({
            name: c.name,
            value: c.value,
          }));
        },
        setAll(cookiesToSet: CookieWithOptions[]): void {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Session get karo taaki refresh ho
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/.*).*)',  // Sab routes pe chalao (limit APIs bhi include kar lo ab)
  ],
};