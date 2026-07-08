'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DagiLoader from '@/components/DagiLoader';
import { Lock } from 'lucide-react';

export default function PaymentProcessingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function poll() {
      const { data } = await supabase.from('bookings').select('payment_reference, status').eq('id', id).single();
      if (cancelled) return;

      if (data?.payment_reference) {
        router.push(`/bookings/${id}/review`);
        return;
      }
      if (attempts >= 15) {
        // ~30s of polling with no confirmation — stop spinning forever
        router.push(`/bookings/${id}/review`);
        return;
      }
      setTimeout(() => setAttempts((a) => a + 1), 2000);
    }
    poll();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempts, id]);

  return (
    <main className="h-[calc(100vh-64px)] w-full flex flex-col justify-center items-center px-container-margin bg-surface">
      <DagiLoader
        label="Securely routing your transaction…"
        sublabel="Muna sarrafa biyan ku..."
      />
      <div className="flex items-center gap-2 text-outline mt-stack-lg">
        <Lock className="h-4 w-4" />
        <span className="font-label-sm text-label-sm uppercase tracking-widest">End-to-End Encrypted</span>
      </div>
    </main>
  );
}
