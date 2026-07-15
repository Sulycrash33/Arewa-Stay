'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SaveButton({ listingId }: { listingId: string }) {
  const { profile, isLoggedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reuse a single Supabase client instance across effect + toggle instead
  // of creating a new one on every call — the browser client is cheap but
  // there's no reason to allocate repeatedly.
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const getSupabase = () => {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  };

  useEffect(() => {
    if (!profile) return;
    const supabase = getSupabase();
    let cancelled = false;
    supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', profile.id)
      .eq('listing_id', listingId)
      .maybeSingle()
      .then(({ data }: { data: { listing_id: string } | null }) => {
        if (!cancelled) setSaved(!!data);
      });
    return () => {
      cancelled = true;
    };
  }, [profile, listingId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn || !profile) {
      router.push('/auth?tab=login');
      return;
    }

    setLoading(true);
    const supabase = getSupabase();
    const wasSaved = saved;

    // Optimistic update — revert on error.
    setSaved(!wasSaved);

    try {
      if (wasSaved) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', profile.id)
          .eq('listing_id', listingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: profile.id, listing_id: listingId });
        if (error) throw error;
      }
    } catch (err) {
      // Revert the optimistic flip and surface the failure.
      setSaved(wasSaved);
      console.error('Failed to toggle favorite:', err);
      toast({
        title: 'Could not save',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
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
