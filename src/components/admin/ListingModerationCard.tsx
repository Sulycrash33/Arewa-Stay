'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Users, Check, X, Loader2 } from 'lucide-react';
import type { Listing } from '@/lib/types';

const STATUS_STYLE: Record<string, string> = {
  approved: 'bg-primary-container/10 text-primary-container',
  pending: 'bg-ochre-gold/10 text-ochre-gold',
  rejected: 'bg-destructive/10 text-destructive',
};

export default function ListingModerationCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null);

  const setStatus = async (status: 'approved' | 'rejected') => {
    setBusy(status === 'approved' ? 'approve' : 'reject');
    const supabase = createClient();
    const { error } = await supabase.from('listings').update({ status }).eq('id', listing.id);
    setBusy(null);

    if (error) {
      toast({ title: 'Could not update listing', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: status === 'approved' ? 'Listing approved, now live' : 'Listing rejected' });
    router.refresh();
  };

  return (
    <div className="rounded-tubali bg-surface-container-lowest tubali-border overflow-hidden flex flex-col sm:flex-row">
      <div className="relative w-full sm:w-48 aspect-video sm:aspect-square shrink-0 bg-surface-container-low">
        {listing.images && listing.images.length > 0 ? (
          <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-xs">No photo</div>
        )}
      </div>

      <div className="flex-1 p-stack-md flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-title-md text-title-md text-on-surface">{listing.title}</h3>
          <span className={`shrink-0 text-xs font-label-md px-2 py-0.5 rounded-full ${STATUS_STYLE[listing.status]}`}>
            {listing.status}
          </span>
        </div>

        <div className="flex items-center gap-3 text-on-surface-variant text-sm">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.city}, {listing.state}</span>
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Up to {listing.max_guests}</span>
        </div>

        <p className="font-body-md text-sm text-on-surface-variant line-clamp-2">{listing.description}</p>

        <div className="text-sm text-on-surface-variant">
          Host: <span className="text-on-surface">{listing.host?.full_name ?? 'Unknown'}</span>
          {' · '}
          {listing.currency === 'NGN' ? '₦' : 'CFA'}{listing.price_per_night.toLocaleString()}/night
        </div>

        {listing.status === 'pending' && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setStatus('approved')}
              disabled={busy !== null}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {busy === 'approve' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Approve
            </button>
            <button
              onClick={() => setStatus('rejected')}
              disabled={busy !== null}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-destructive/40 text-destructive font-label-md text-label-md hover:bg-destructive/5 transition-colors disabled:opacity-60"
            >
              {busy === 'reject' ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
