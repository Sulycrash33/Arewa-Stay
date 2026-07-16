'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import DagiLoader from '@/components/DagiLoader';
import { AlertTriangle } from 'lucide-react';

export default function ReportIssuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useUser();
  const { toast } = useToast();
  const [booking, setBooking] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!profile) return;
      const supabase = createClient();
      const { data } = await supabase
        .from('bookings')
        .select('id, guest_id, listing:listings ( title, host_id )')
        .eq('id', id)
        .single();
      setBooking(data);
      setLoading(false);
    }
    load();
  }, [id, profile]);

  if (loading || !profile) return <DagiLoader label="Loading booking" sublabel="Muna dawo da bayanai..." />;
  if (!booking) return <p className="text-center py-stack-lg">Booking not found.</p>;

  const isParticipant = booking.guest_id === profile.id || booking.listing?.host_id === profile.id;
  if (!isParticipant) return <p className="text-center py-stack-lg">You&apos;re not part of this booking.</p>;

  const handleSubmit = async () => {
    if (reason.trim().length < 10) {
      toast({ title: 'Please describe the issue in a bit more detail', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from('disputes').insert({
      booking_id: booking.id,
      opened_by: profile.id,
      reason,
      status: 'open',
    });
    setSubmitting(false);

    if (error) {
      toast({ title: 'Could not submit report', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Report submitted', description: 'Our team will review this and follow up.' });
    router.push('/dashboard/bookings');
  };

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <h1 className="font-headline-lg text-headline-lg text-m3-primary">Report an issue</h1>
      </div>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">
        For &quot;{booking.listing?.title}&quot;. Our team reviews every report and may involve a community liaison if
        the situation needs local context.
      </p>

      <div className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md">
        <label className="block font-label-md text-label-md text-on-surface-variant mb-1">What happened?</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe the issue, be as specific as you can about dates and what occurred."
          className="w-full bg-transparent border-2 border-clay-brown/30 rounded-lg focus:ring-0 focus:border-primary-container px-3 py-2 font-body-md min-h-[140px] mb-stack-md"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-destructive text-white font-title-md text-title-md py-3 rounded-full hover:opacity-90 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit Report'}
        </button>
      </div>
    </main>
  );
}
