'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

export default function SaveButton({ listingId }: { listingId: string }) {
  const { profile, isLoggedIn } = useUser();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', profile.id)
      .eq('listing_id', listingId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setSaved(!!data);
      });
  }, [profile, listingId, supabase]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn || !profile) {
      router.push('/auth?tab=login');
      return;
    }

    setLoading(true);
    const previousSaved = saved;
    const nextSaved = !saved;
    setSaved(nextSaved);

    try {
      const { error } = previousSaved
        ? await supabase.from('favorites').delete().eq('user_id', profile.id).eq('listing_id', listingId)
        : await supabase.from('favorites').insert({ user_id: profile.id, listing_id: listingId });

      if (error) throw error;
    } catch (error) {
      setSaved(previousSaved);
      console.error('Could not update favorite', error);
    } finally {
      setLoading(false);
    }
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
