// Browser-side Supabase client, safe to use in client components.
import { createBrowserClient } from '@supabase/ssr';
import { createMockSupabaseClient } from '@/lib/supabase/mock-client';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return createMockSupabaseClient();
  }

  return createBrowserClient(url, key);
}
