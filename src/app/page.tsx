import { getListings } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';
import HeroSearch from '@/components/HeroSearch';
import CuratedCollections from '@/components/home/CuratedCollections';
import ExploreDestinations from '@/components/home/ExploreDestinations';
import JourneyTypes from '@/components/home/JourneyTypes';
import { BrandStory, HostCTABanner, Testimonials } from '@/components/home/StorySections';
import TravelGuides from '@/components/home/TravelGuides';
import Link from 'next/link';

export default async function HomePage() {
  const listings = await getListings();
  const featured = listings.slice(0, 3);

  return (
    <div>
      <HeroSearch />

      <CuratedCollections />
      <ExploreDestinations />
      <JourneyTypes />

      {/* Featured Stays */}
      <section className="container mx-auto px-4 py-stack-lg">
        <div className="flex items-end justify-between mb-stack-md">
          <div>
            <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-widest">Featured Stays</span>
            <h2 className="font-headline-lg text-headline-lg text-m3-primary mt-1">Handpicked stays, approved for quality and comfort.</h2>
          </div>
          <Link href="/listings" className="hidden md:flex items-center gap-1 font-label-md text-label-md text-primary-container hover:underline shrink-0">
            View all stays →
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((listing) => (
              <PropertyCard key={listing.id} property={listing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-on-surface-variant py-stack-lg">
            No approved listings yet — once hosts start onboarding, their stays will show up here.
          </p>
        )}
      </section>

      <BrandStory />
      <HostCTABanner />
      <Testimonials />
      <TravelGuides />
    </div>
  );
}
