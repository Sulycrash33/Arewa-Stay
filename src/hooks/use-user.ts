'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';

export function useUser() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (mounted) { setProfile(null); setLoading(false); }
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (mounted) { setProfile(data); setLoading(false); }
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return { profile, isLoggedIn: !!profile, loading, signOut };
}
