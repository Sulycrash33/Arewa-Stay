'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import DagiLoader from '@/components/DagiLoader';

export default function LeaveReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useUser();
  const { toast } = useToast();
  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!profile) return;
      const supabase = createClient();
      const { data } = await supabase
        .from('bookings')
        .select(`
          id, guest_id, status,
          listing:listings ( id, title, host_id ),
          guest:profiles!bookings_guest_id_fkey ( id, full_name )
        `)
        .eq('id', id)
        .single();
      setBooking(data);
      setLoading(false);
    }
    load();
  }, [id, profile]);

  if (loading || !profile) return <DagiLoader label="Loading booking" sublabel="Muna dawo da bayanai..." />;
  if (!booking) return <p className="text-center py-stack-lg">Booking not found.</p>;

  const isGuest = booking.guest_id === profile.id;
  const isHost = booking.listing?.host_id === profile.id;
  if (!isGuest && !isHost) return <p className="text-center py-stack-lg">You&apos;re not part of this booking.</p>;
  if (booking.status !== 'completed') return <p className="text-center py-stack-lg">This stay hasn&apos;t been completed yet.</p>;

  const reviewee = isGuest
    ? { id: booking.listing.host_id, label: 'the host' }
    : { id: booking.guest_id, label: booking.guest?.full_name ?? 'the guest' };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: 'Please select a star rating', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from('reviews').insert({
      listing_id: booking.listing.id,
      booking_id: booking.id,
      author_id: profile.id,
      reviewee_id: reviewee.id,
      rating,
      comment,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: 'Could not submit review', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Review submitted, thank you' });
    router.push('/dashboard/bookings');
  };

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-lg">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Rate your stay</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">
        Your review of {reviewee.label} for &quot;{booking.listing.title}&quot; helps other users trust the platform.
      </p>

      <div className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md">
        <div className="flex justify-center gap-1 mb-stack-md">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(n)}
            >
              <Star
                className={cn(
                  'h-8 w-8 transition-colors',
                  n <= (hoverRating || rating) ? 'fill-ochre-gold text-ochre-gold' : 'text-outline-variant'
                )}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`How was your experience with ${reviewee.label}?`}
          className="w-full bg-transparent border-2 border-clay-brown/30 rounded-lg focus:ring-0 focus:border-primary-container px-3 py-2 font-body-md min-h-[120px] mb-stack-md"
        />

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-primary-container text-on-primary font-title-md text-title-md py-3 rounded-full hover:opacity-90 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
      </div>
    </main>
  );
}
