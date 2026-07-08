import { notFound } from 'next/navigation';
import { getBookingForReview } from '@/lib/data';
import BookingResponseActions from '@/components/BookingResponseActions';
import { ShieldCheck, Star } from 'lucide-react';

const TIER_LABEL: Record<string, string> = {
  bako: 'New Guest',
  majidadin: 'Trusted Guest',
  sarki: 'Elite Guest',
};

export default async function BookingReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let booking;
  try {
    booking = await getBookingForReview(id);
  } catch {
    notFound();
  }
  if (!booking) notFound();

  const guest = booking.guest as any;
  const listing = booking.listing as any;
  const nights = Math.round(
    (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / 86400000
  );

  return (
    <main className="flex-grow flex flex-col px-container-margin py-stack-lg max-w-2xl mx-auto w-full">
      <div className="mb-stack-lg text-center">
        <ShieldCheck className="h-12 w-12 text-primary-container mx-auto mb-stack-sm" />
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-m3-primary mb-unit">Review Request</h1>
        <p className="font-body-md text-on-surface-variant">Please review the guest's details before accepting.</p>
      </div>

      {/* Guest info Tubali card */}
      <section className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md mb-stack-lg flex flex-col sm:flex-row gap-stack-md items-center sm:items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-sm z-10 bg-surface-container flex items-center justify-center text-2xl font-title-md text-m3-primary">
          {guest?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={guest.avatar_url} alt={guest.full_name} className="w-full h-full object-cover" />
          ) : (
            guest?.full_name?.[0]?.toUpperCase() ?? '?'
          )}
        </div>
        <div className="flex-grow text-center sm:text-left z-10">
          <h2 className="font-title-md text-title-md text-on-surface mb-unit">{guest?.full_name ?? 'Guest'}</h2>
          <p className="font-body-md text-on-surface-variant mb-stack-sm">
            {TIER_LABEL[guest?.host_tier] ?? 'New Guest'} &middot; {listing?.city}, {listing?.state}
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1 bg-surface-container-low text-on-surface-variant font-label-md text-label-md px-3 py-1 rounded-full">
              <Star className="h-3.5 w-3.5" />
              {guest?.completed_stays ?? 0} stays
            </span>
          </div>
        </div>
      </section>

      {/* Stay details */}
      <section className="tubali-border rounded-xl p-stack-md mb-stack-lg bg-surface-container-low/50">
        <h3 className="font-title-md text-title-md text-m3-primary mb-stack-sm">Stay Details</h3>
        <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
          <span className="font-body-md text-on-surface-variant">Property</span>
          <span className="font-body-md text-on-surface font-semibold">{listing?.title}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
          <span className="font-body-md text-on-surface-variant">Dates</span>
          <span className="font-body-md text-on-surface font-semibold">
            {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()} ({nights} nights)
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
          <span className="font-body-md text-on-surface-variant">Guests</span>
          <span className="font-body-md text-on-surface font-semibold">{booking.guests_count}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="font-body-md text-on-surface-variant">Total</span>
          <span className="font-body-md text-on-surface font-semibold text-primary-container">
            {booking.currency === 'NGN' ? '₦' : 'CFA'}{Number(booking.total_price).toLocaleString()}
          </span>
        </div>
      </section>

      {booking.status === 'pending' ? (
        <BookingResponseActions bookingId={booking.id} />
      ) : (
        <p className="text-center font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          This request has already been {booking.status}.
        </p>
      )}
    </main>
  );
}
