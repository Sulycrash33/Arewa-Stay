import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getListingById, getReviewsForListing } from '@/lib/data';
import BookingWidget from '@/components/BookingWidget';
import MessageHostButton from '@/components/MessageHostButton';
import { MapPin, Star, Sun, Droplets, DoorOpen, Home } from 'lucide-react';

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const reviews = await getReviewsForListing(id);
  const images = listing.images?.length ? listing.images : ['/placeholder-listing.jpg'];

  const culturalBadges = [
    listing.has_zaure && { icon: DoorOpen, label: 'Private welcome area' },
    listing.detached_quarters && { icon: Home, label: 'Separate, private space' },
    listing.has_247_solar && { icon: Sun, label: 'Always-on power' },
    listing.has_borehole && { icon: Droplets, label: 'Reliable water supply' },
  ].filter(Boolean) as { icon: any; label: string }[];

  return (
    <main className="container mx-auto px-4 py-stack-lg">
      <div className="mb-stack-md">
        <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">{listing.title}</h1>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-clay-brown" />{listing.city}, {listing.state}</span>
          {listing.avg_rating ? (
            <span className="flex items-center gap-1"><Star className="h-4 w-4 text-ochre-gold fill-ochre-gold" />{listing.avg_rating.toFixed(1)} ({listing.review_count} reviews)</span>
          ) : (
            <span className="text-sm">New listing</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-stack-lg rounded-tubali overflow-hidden">
        <div className="col-span-2 row-span-2 relative aspect-square md:aspect-auto">
          <Image src={images[0]} alt={listing.title} fill className="object-cover" />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="relative aspect-square hidden md:block">
            <Image src={img} alt={`${listing.title} photo ${i + 2}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <div className="lg:col-span-2 space-y-stack-lg">
          <section>
            <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm">About this stay</h2>
            <p className="font-body-md text-on-surface-variant whitespace-pre-line">{listing.description}</p>
          </section>

          {culturalBadges.length > 0 && (
            <section>
              <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm">Comfort &amp; Convenience</h2>
              <div className="grid grid-cols-2 gap-stack-sm">
                {culturalBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-xl border border-outline-variant/30 p-stack-sm">
                    <Icon className="h-5 w-5 text-primary-container" />
                    <span className="font-body-md text-sm text-on-surface">{label}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {listing.amenities && listing.amenities.length > 0 && (
            <section>
              <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm">Amenities</h2>
              <div className="grid grid-cols-2 gap-stack-sm">
                {listing.amenities.map((a) => (
                  <div key={a.id} className="font-body-md text-sm text-on-surface-variant">{a.name}</div>
                ))}
              </div>
            </section>
          )}

          {reviews.length > 0 && (
            <section>
              <h2 className="font-title-md text-title-md text-m3-primary mb-stack-sm">Reviews</h2>
              <div className="space-y-stack-md">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b border-outline-variant/20 pb-stack-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3.5 w-3.5 text-ochre-gold fill-ochre-gold" />
                      <span className="font-label-md text-label-md">{r.rating.toFixed(1)}</span>
                    </div>
                    <p className="font-body-md text-sm text-on-surface-variant">{r.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div>
          <BookingWidget listing={listing} />
          <div className="mt-stack-sm">
            <MessageHostButton listingId={listing.id} hostId={listing.host_id} />
          </div>
        </div>
      </div>
    </main>
  );
}
