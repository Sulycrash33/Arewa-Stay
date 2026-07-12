import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getListingById } from '@/lib/data';
import WizardProgress from '@/components/host/WizardProgress';
import { MapPin, Users, CheckCircle2 } from 'lucide-react';

export default async function ReviewStep({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const culturalBadges = [
    listing.has_zaure && 'Zaure reception',
    listing.detached_quarters && 'Detached quarters',
    listing.has_247_solar && '24/7 solar',
    listing.has_borehole && 'Borehole water',
    listing.women_only && 'Women-only',
    listing.family_only && 'Family-only',
    listing.no_alcohol && 'No alcohol',
  ].filter(Boolean) as string[];

  return (
    <main className="container mx-auto px-4 py-stack-lg max-w-2xl">
      <WizardProgress step={6} />

      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Review your listing</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">
        Here's what guests will see. Once submitted, our team reviews it before it goes live.
      </p>

      <div className="rounded-tubali bg-surface-container-lowest tubali-border overflow-hidden mb-stack-lg">
        {listing.images && listing.images.length > 0 && (
          <div className="grid grid-cols-2 gap-1">
            {listing.images.slice(0, 4).map((img, i) => (
              <div key={i} className="relative aspect-video">
                <Image src={img} alt={`Photo ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
        <div className="p-stack-md">
          <h2 className="font-title-md text-title-md text-on-surface mb-1">{listing.title}</h2>
          <div className="flex items-center gap-3 text-on-surface-variant text-sm mb-stack-sm">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.city}, {listing.state}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />Up to {listing.max_guests} guests</span>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant mb-stack-sm">{listing.description}</p>

          {culturalBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-stack-sm">
              {culturalBadges.map((b) => (
                <span key={b} className="text-xs rounded-full bg-primary-container/10 text-primary-container px-2 py-0.5">{b}</span>
              ))}
            </div>
          )}

          {listing.amenities && listing.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-stack-sm">
              {listing.amenities.map((a) => (
                <span key={a.id} className="text-xs rounded-full bg-surface-container-low text-on-surface-variant px-2 py-0.5">{a.name}</span>
              ))}
            </div>
          )}

          <div className="border-t border-outline-variant/20 pt-stack-sm mt-stack-sm">
            <span className="font-title-md text-title-md text-m3-primary">
              {listing.currency === 'NGN' ? '₦' : 'CFA'}{listing.price_per_night.toLocaleString()}
            </span>
            <span className="text-on-surface-variant"> /night</span>
          </div>
        </div>
      </div>

      <div className="rounded-tubali bg-primary-container/10 p-stack-md flex gap-stack-sm items-start mb-stack-lg">
        <CheckCircle2 className="h-5 w-5 text-primary-container mt-0.5 shrink-0" />
        <p className="font-body-md text-sm text-on-surface-variant">
          Your listing is saved and awaiting review. We check every listing before it goes live to keep the platform trustworthy for guests. You can track its status from your host dashboard.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-stack-sm">
        <Link href={`/host/listings/${id}/pricing`} className="flex-1 text-center px-6 py-3 rounded-full border border-tertiary-container text-primary-container font-label-md text-label-md hover:bg-surface-container-low transition-colors">
          Edit details
        </Link>
        <Link href="/host/listings" className="flex-1 text-center px-6 py-3 rounded-full bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity">
          Go to my listings
        </Link>
      </div>
    </main>
  );
}
