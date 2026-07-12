import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ListingModerationActions from '@/components/admin/ListingModerationActions';
import { MapPin } from 'lucide-react';

export default async function AdminListingsPage() {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from('listings')
    .select(`
      id, title, city, state, price_per_night, currency, status, created_at,
      host:profiles!listings_host_id_fkey ( full_name, host_tier ),
      listing_images ( url, sort_order )
    `)
    .order('created_at', { ascending: true });

  const pending = (listings ?? []).filter((l) => l.status === 'pending');
  const others = (listings ?? []).filter((l) => l.status !== 'pending');

  const renderCard = (listing: any) => {
    const image = (listing.listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.url;
    return (
      <div key={listing.id} className="rounded-tubali bg-surface-container-lowest tubali-border overflow-hidden">
        <div className="relative aspect-video bg-surface-container-low">
          {image ? (
            <Image src={image} alt={listing.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">No photos</div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-title-md text-sm text-on-surface truncate">{listing.title}</h3>
          <div className="flex items-center gap-1 text-on-surface-variant text-xs mt-1">
            <MapPin className="h-3 w-3" />{listing.city}, {listing.state}
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Host: {listing.host?.full_name ?? 'Unknown'} &middot; {listing.host?.host_tier}
          </p>
          <p className="font-label-md text-label-md text-m3-primary mt-1">
            {listing.currency === 'NGN' ? '₦' : 'CFA'}{Number(listing.price_per_night).toLocaleString()}/night
          </p>
          <Link href={`/listings/${listing.id}`} target="_blank" className="text-xs text-primary-container hover:underline block mt-1">
            View full listing →
          </Link>
          {listing.status === 'pending' ? (
            <div className="mt-2">
              <ListingModerationActions listingId={listing.id} />
            </div>
          ) : (
            <span className={`inline-block mt-2 text-xs capitalize px-2 py-0.5 rounded-full ${listing.status === 'approved' ? 'bg-primary-container/10 text-primary-container' : 'bg-destructive/10 text-destructive'}`}>
              {listing.status}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="p-container-margin">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Listings</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">{pending.length} awaiting review</p>

      {pending.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-stack-md mb-stack-lg">
          {pending.map(renderCard)}
        </div>
      )}

      {others.length > 0 && (
        <>
          <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm mt-stack-lg">Reviewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-stack-md">
            {others.map(renderCard)}
          </div>
        </>
      )}

      {(listings ?? []).length === 0 && (
        <p className="text-center font-body-lg text-on-surface-variant py-stack-lg">No listings submitted yet.</p>
      )}
    </main>
  );
}
