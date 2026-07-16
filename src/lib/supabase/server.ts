// Server-side Supabase client, for Server Components, Route Handlers, Server Actions.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createMockSupabaseClient } from '@/lib/supabase/mock-client';

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return createMockSupabaseClient();
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component, safe to ignore if middleware refreshes sessions
          }
        },
      },
    }
  );
}
