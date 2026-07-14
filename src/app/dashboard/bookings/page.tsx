import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MapPin, Star, AlertTriangle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-ochre-gold/10 text-ochre-gold',
  confirmed: 'bg-primary-container/10 text-primary-container',
  completed: 'bg-emerald-green/10 text-emerald-green',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default async function MyBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth?tab=login');

  // Opportunistically flip any bookings whose checkout has passed into
  // 'completed' before we read them, so status reflects reality without
  // needing a scheduled job.
  await supabase.rpc('mark_completed_bookings');

  const { data: asGuest } = await supabase
    .from('bookings')
    .select(`
      id, check_in, check_out, status, total_price, currency, guest_id,
      listing:listings ( id, title, city, state, host_id ),
      reviews:reviews!reviews_booking_id_fkey ( id, author_id )
    `)
    .eq('guest_id', user.id)
    .order('check_in', { ascending: false });

  const { data: asHost } = await supabase
    .from('bookings')
    .select(`
      id, check_in, check_out, status, total_price, currency, guest_id,
      listing:listings!inner ( id, title, city, state, host_id ),
      guest:profiles!bookings_guest_id_fkey ( full_name ),
      reviews:reviews!reviews_booking_id_fkey ( id, author_id )
    `)
    .eq('listing.host_id', user.id)
    .order('check_in', { ascending: false });

  const renderBooking = (b: any, role: 'guest' | 'host') => {
    const hasReviewed = (b.reviews ?? []).some((r: any) => r.author_id === user.id);
    const canReview = b.status === 'completed' && !hasReviewed;
    const canDispute = b.status === 'confirmed' || b.status === 'completed';

    return (
      <div key={b.id} className="rounded-tubali bg-surface-container-lowest tubali-border p-stack-md">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-title-md text-sm text-on-surface">{b.listing?.title}</h3>
          <span className={cn('text-xs capitalize px-2 py-0.5 rounded-full shrink-0', STATUS_STYLE[b.status])}>{b.status}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-1">
          <MapPin className="h-3 w-3" />{b.listing?.city}, {b.listing?.state}
        </div>
        <p className="text-xs text-on-surface-variant mb-2">
          {new Date(b.check_in).toLocaleDateString()} – {new Date(b.check_out).toLocaleDateString()}
          {role === 'host' && b.guest?.full_name && <> &middot; Guest: {b.guest.full_name}</>}
        </p>
        <div className="flex flex-wrap gap-2">
          {canReview && (
            <Link href={`/bookings/${b.id}/rate`} className="flex items-center gap-1 text-xs bg-primary-container text-on-primary px-3 py-1.5 rounded-full hover:opacity-90">
              <Star className="h-3.5 w-3.5" /> Leave a review
            </Link>
          )}
          {hasReviewed && <span className="text-xs text-on-surface-variant px-3 py-1.5">Review submitted</span>}
          {canDispute && (
            <Link href={`/bookings/${b.id}/dispute`} className="flex items-center gap-1 text-xs border border-destructive/40 text-destructive px-3 py-1.5 rounded-full hover:bg-destructive/10">
              <AlertTriangle className="h-3.5 w-3.5" /> Report an issue
            </Link>
          )}
          <Link href="/dashboard/messages" className="flex items-center gap-1 text-xs border border-outline-variant/40 text-on-surface-variant px-3 py-1.5 rounded-full hover:bg-surface-container-low">
            <MessageSquare className="h-3.5 w-3.5" /> Messages
          </Link>
        </div>
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-2xl">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-stack-lg">My Bookings</h1>

      {(asGuest ?? []).length > 0 && (
        <>
          <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm">As a Guest</h2>
          <div className="space-y-stack-sm mb-stack-lg">{asGuest!.map((b) => renderBooking(b, 'guest'))}</div>
        </>
      )}

      {(asHost ?? []).length > 0 && (
        <>
          <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm">As a Host</h2>
          <div className="space-y-stack-sm">{asHost!.map((b) => renderBooking(b, 'host'))}</div>
        </>
      )}

      {(asGuest ?? []).length === 0 && (asHost ?? []).length === 0 && (
        <p className="text-center font-body-lg text-on-surface-variant py-stack-lg">
          No bookings yet. <Link href="/listings" className="text-primary-container hover:underline">Browse stays</Link> to get started.
        </p>
      )}
    </main>
  );
}
