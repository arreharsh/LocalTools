
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Manual fallback for getAll() in dev mode
          const allCookies = cookieStore.getAll ? cookieStore.getAll() : [];
          return allCookies.map(c => ({
            name: c.name,
            value: c.value,
          }));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (e) {
            // Ignore in dev mode
            console.warn('Cookie set ignored in dev mode:', e);
          }
        },
      },
    }
  );
}