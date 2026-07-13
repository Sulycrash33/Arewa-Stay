'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { MessageSquare, Loader2 } from 'lucide-react';

export default function MessageHostButton({ listingId, hostId }: { listingId: string; hostId: string }) {
  const router = useRouter();
  const { profile, isLoggedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isLoggedIn || !profile) {
      router.push('/auth?tab=login');
      return;
    }
    if (profile.id === hostId) return; // hosts don't message themselves

    setLoading(true);
    const supabase = createClient();

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('listing_id', listingId)
      .eq('guest_id', profile.id)
      .eq('host_id', hostId)
      .maybeSingle();

    if (existing) {
      router.push(`/dashboard/messages/${existing.id}`);
      return;
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({ listing_id: listingId, guest_id: profile.id, host_id: hostId })
      .select()
      .single();

    setLoading(false);
    if (!error && data) router.push(`/dashboard/messages/${data.id}`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 border border-outline-variant/40 text-m3-primary font-title-md text-sm py-2.5 rounded-full hover:bg-surface-container-low transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
      Message host
    </button>
  );
}
