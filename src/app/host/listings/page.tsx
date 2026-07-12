import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { getHostListings } from '@/lib/data';
import { Plus, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<string, string> = {
  approved: 'bg-primary-container/10 text-primary-container',
  pending: 'bg-ochre-gold/10 text-ochre-gold',
  rejected: 'bg-destructive/10 text-destructive',
};

export default async function HostListingsDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth?tab=login');

  const listings = await getHostListings(user.id);

  return (
    <main className="container mx-auto px-4 py-stack-lg">
      <div className="flex items-center justify-between mb-stack-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-m3-primary">My Listings</h1>
          <p className="font-body-md text-on-surface-variant mt-1">{listings.length} {listings.length === 1 ? 'property' : 'properties'}</p>
        </div>
        <Link href="/host/listings/new" className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-title-md text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-all whitespace-nowrap">
          <Plus className="h-4 w-4" /> Add listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-stack-lg rounded-tubali border border-outline-variant/30 bg-surface-container-low">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-md">You haven&apos;t listed a property yet.</p>
          <Link href="/host/listings/new" className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-title-md text-sm px-6 py-2.5 rounded-full hover:opacity-90 transition-all">
            <Plus className="h-4 w-4" /> List your first property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={listing.status === 'approved' ? `/listings/${listing.id}` : `/host/listings/${listing.id}/review`}
              className="rounded-tubali bg-surface-container-lowest tubali-border overflow-hidden hover:shadow-tubali transition-shadow"
            >
              <div className="relative aspect-video bg-surface-container-low">
                {listing.images && listing.images.length > 0 ? (
                  <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">No photos yet</div>
                )}
                <span className={cn('absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full capitalize', STATUS_STYLE[listing.status])}>
                  {listing.status}
                </span>
              </div>
              <div className="p-3">
                <h3 className="font-title-md text-sm text-on-surface truncate">{listing.title}</h3>
                <div className="flex items-center gap-1 text-on-surface-variant text-xs mt-1">
                  <MapPin className="h-3 w-3" />
                  {listing.city}, {listing.state}
                </div>
                <div className="mt-1 font-label-md text-label-md text-m3-primary">
                  {listing.price_per_night > 0
                    ? `${listing.currency === 'NGN' ? '₦' : 'CFA'}${listing.price_per_night.toLocaleString()}/night`
                    : 'Pricing not set'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
