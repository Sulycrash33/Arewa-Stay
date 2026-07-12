'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

export default function ListingModerationActions({ listingId }: { listingId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  const handle = async (action: 'approve' | 'reject') => {
    setLoading(action);
    const supabase = createClient();
    const { error } = await supabase
      .from('listings')
      .update({ status: action === 'approve' ? 'approved' : 'rejected' })
      .eq('id', listingId);
    setLoading(null);

    if (error) {
      toast({ title: 'Action failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: action === 'approve' ? 'Listing approved' : 'Listing rejected' });
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle('approve')}
        disabled={loading !== null}
        className="flex-1 flex items-center justify-center gap-1 bg-primary-container text-on-primary text-sm font-label-md py-2 rounded-full hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        <Check className="h-4 w-4" /> Approve
      </button>
      <button
        onClick={() => handle('reject')}
        disabled={loading !== null}
        className="flex-1 flex items-center justify-center gap-1 border border-destructive text-destructive text-sm font-label-md py-2 rounded-full hover:bg-destructive/10 disabled:opacity-60 transition-colors"
      >
        <X className="h-4 w-4" /> Reject
      </button>
    </div>
  );
}
