'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import type { Listing } from '@/lib/types';

export default function BookingWidget({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { profile, isLoggedIn } = useUser();
  const { toast } = useToast();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const nights = checkIn && checkOut
    ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 0;
  const total = nights * listing.price_per_night;

  const handleBook = async () => {
    if (!isLoggedIn || !profile) {
      router.push('/auth?tab=login');
      return;
    }
    if (!checkIn || !checkOut || nights <= 0) {
      toast({ title: 'Pick valid check-in and check-out dates', variant: 'destructive' });
      return;
    }
    if (guests > listing.max_guests) {
      toast({ title: `This stay allows up to ${listing.max_guests} guests`, variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        listing_id: listing.id,
        guest_id: profile.id,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guests,
        total_price: total,
        currency: listing.currency,
      })
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      if (error.code === '23P01') {
        toast({ title: 'Those dates were just booked', description: 'Please choose different dates.', variant: 'destructive' });
      } else {
        toast({ title: 'Booking failed', description: error.message, variant: 'destructive' });
      }
      return;
    }

    toast({ title: 'Request sent — awaiting host response (Maraba)' });
    router.push(`/bookings/${data.id}/processing`);
  };

  return (
    <div className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md shadow-tubali sticky top-24">
      <div className="mb-stack-md">
        <span className="font-title-md text-title-md text-m3-primary">
          {listing.currency === 'NGN' ? '₦' : 'CFA'}{listing.price_per_night.toLocaleString()}
        </span>
        <span className="text-on-surface-variant"> /night</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-stack-sm">
        <div className="border border-outline-variant/40 rounded-lg p-2">
          <label className="block font-label-sm text-label-sm text-on-surface-variant">Check-in</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent text-sm focus:outline-none" />
        </div>
        <div className="border border-outline-variant/40 rounded-lg p-2">
          <label className="block font-label-sm text-label-sm text-on-surface-variant">Check-out</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent text-sm focus:outline-none" />
        </div>
      </div>

      <div className="border border-outline-variant/40 rounded-lg p-2 mb-stack-md">
        <label className="block font-label-sm text-label-sm text-on-surface-variant">Guests</label>
        <input
          type="number"
          min={1}
          max={listing.max_guests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      {nights > 0 && (
        <div className="flex justify-between text-sm text-on-surface-variant mb-stack-md">
          <span>{listing.currency === 'NGN' ? '₦' : 'CFA'}{listing.price_per_night.toLocaleString()} × {nights} nights</span>
          <span>{listing.currency === 'NGN' ? '₦' : 'CFA'}{total.toLocaleString()}</span>
        </div>
      )}

      <button
        onClick={handleBook}
        disabled={submitting}
        className="w-full bg-primary-container text-on-primary font-title-md text-title-md py-3 rounded-full hover:opacity-90 transition-colors disabled:opacity-60"
      >
        {submitting ? 'Sending request…' : 'Request to Book'}
      </button>
      <p className="text-xs text-on-surface-variant text-center mt-stack-sm">
        The host has 12 hours to accept (Maraba) or decline — you won't be charged until they respond.
      </p>
    </div>
  );
}
