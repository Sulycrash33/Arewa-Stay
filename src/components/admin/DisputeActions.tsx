'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function DisputeActions({ disputeId, currentStatus }: { disputeId: string; currentStatus: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handle = async (status: 'investigating' | 'closed') => {
    setLoading(status);
    const supabase = createClient();
    const { error } = await supabase.from('disputes').update({ status }).eq('id', disputeId);
    setLoading(null);

    if (error) {
      toast({ title: 'Action failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: `Marked as ${status}` });
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      {currentStatus === 'open' && (
        <button
          onClick={() => handle('investigating')}
          disabled={loading !== null}
          className="flex-1 bg-ochre-gold/10 text-ochre-gold text-sm font-label-md py-2 rounded-full hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          Start investigating
        </button>
      )}
      {currentStatus !== 'closed' && (
        <button
          onClick={() => handle('closed')}
          disabled={loading !== null}
          className="flex-1 bg-primary-container text-on-primary text-sm font-label-md py-2 rounded-full hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          Mark closed
        </button>
      )}
    </div>
  );
}
