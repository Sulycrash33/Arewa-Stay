'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

export default function SaveButton({ listingId }: { listingId: string }) {
  const { profile, isLoggedIn } = useUser();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const supabase = createClient();
    supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', profile.id)
      .eq('listing_id', listingId)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [profile, listingId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn || !profile) {
      router.push('/auth?tab=login');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (saved) {
      await supabase.from('favorites').delete().eq('user_id', profile.id).eq('listing_id', listingId);
      setSaved(false);
    } else {
      await supabase.from('favorites').insert({ user_id: profile.id, listing_id: listingId });
      setSaved(true);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? 'Remove from saved' : 'Save this stay'}
      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-inverse-surface/60 flex items-center justify-center hover:bg-inverse-surface/80 transition-colors"
    >
      <Heart className={cn('h-4 w-4 transition-colors', saved ? 'fill-ochre-gold text-ochre-gold' : 'text-inverse-on-surface')} />
    </button>
  );
}
