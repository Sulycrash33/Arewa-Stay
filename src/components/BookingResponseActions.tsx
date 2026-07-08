'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function BookingResponseActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null);

  const handleRespond = async (action: 'accept' | 'decline') => {
    setLoading(action);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('bookings')
        .update({
          status: action === 'accept' ? 'confirmed' : 'cancelled',
          host_responded_at: new Date().toISOString(),
        })
        .eq('id', bookingId);
      if (error) throw error;
      toast({
        title: action === 'accept' ? 'Booking accepted — Maraba!' : 'Booking declined',
        description: action === 'accept'
          ? 'The guest has been notified and payment will be released to you on schedule.'
          : 'The guest has been notified and their hold has been released.',
      });
      router.push('/dashboard/host/verification');
      router.refresh();
    } catch (err) {
      toast({ title: 'Something went wrong', description: String(err), variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mt-auto pt-stack-lg flex flex-col gap-stack-md">
      <button
        onClick={() => handleRespond('accept')}
        disabled={loading !== null}
        className="w-full bg-primary-container text-on-primary hover:opacity-90 active:scale-[0.98] transition-all py-4 px-6 rounded-full flex flex-col items-center justify-center shadow-md disabled:opacity-60"
      >
        <span className="font-title-md text-title-md text-on-primary">{loading === 'accept' ? 'Accepting…' : 'Maraba'}</span>
        <span className="font-label-sm text-label-sm text-on-primary/80 mt-1 uppercase tracking-wider">Accept Booking</span>
      </button>
      <button
        onClick={() => handleRespond('decline')}
        disabled={loading !== null}
        className="w-full bg-transparent border-2 border-clay-brown text-primary-container hover:bg-surface-container-low active:scale-[0.98] transition-all py-4 px-6 rounded-full flex flex-col items-center justify-center disabled:opacity-60"
      >
        <span className="font-title-md text-title-md text-primary-container">{loading === 'decline' ? 'Declining…' : 'Nemi Wani'}</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 uppercase tracking-wider">Decline / Relocate</span>
      </button>
    </div>
  );
}
