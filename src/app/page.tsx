import { getListings } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';
import HeroSearch from '@/components/HeroSearch';
import { Heart, Shield, Users, Gem, Building, Briefcase } from 'lucide-react';

export default async function HomePage() {
  const listings = await getListings();
  const featured = listings.slice(0, 4);

  return (
    <div>
      <HeroSearch />

      {/* Featured Stays */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold">Featured Stays</h2>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((listing) => (
              <PropertyCard key={listing.id} property={listing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No approved listings yet — once hosts start onboarding, their stays will show up here.
          </p>
        )}
      </section>

      {/* Unique Stays Section */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-2 font-headline text-3xl font-bold">Unique Stays for Every Occasion</h2>
          <p className="mx-auto mb-10 max-w-2xl text-muted-foreground">
            From cultural celebrations to professional needs, find spaces tailored for you.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-background p-6 shadow-sm">
              <div className="mb-4 rounded-full bg-km-gold/15 p-4">
                <Gem className="h-8 w-8 text-km-gold" />
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold">Wedding Prep Suites</h3>
              <p className="text-muted-foreground">
                Apartments with makeup stations, photo-friendly decor, and space for pre-wedding ceremonies.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-background p-6 shadow-sm">
              <div className="mb-4 rounded-full bg-km-gold/15 p-4">
                <Building className="h-8 w-8 text-km-gold" />
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold">Family & Event Houses</h3>
              <p className="text-muted-foreground">
                Spacious homes for private gatherings, with women-only or family-only options.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-background p-6 shadow-sm">
              <div className="mb-4 rounded-full bg-km-gold/15 p-4">
                <Briefcase className="h-8 w-8 text-km-gold" />
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold">Long-Stay Nomad Packages</h3>
              <p className="text-muted-foreground">
                Discounted monthly rates for NGO workers and traders, with laundry and meal-plan add-ons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose ArewaStay */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 font-headline text-3xl font-bold">Why Choose Arewa Stay</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-km-gold/15 p-4">
                <Heart className="h-8 w-8 text-km-gold" />
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold">Culturally attuned</h3>
              <p className="text-muted-foreground">
                Women-only, family-only, and no-alcohol filters built in from day one — not bolted on.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-km-gold/15 p-4">
                <Shield className="h-8 w-8 text-km-gold" />
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold">Verified hosts</h3>
              <p className="text-muted-foreground">
                Every listing goes through admin review before it's visible to guests.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm">
              <div className="mb-4 rounded-full bg-km-gold/15 p-4">
                <Users className="h-8 w-8 text-km-gold" />
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold">Cross-border, both currencies</h3>
              <p className="text-muted-foreground">
                Naira and CFA Franc supported natively for stays across Nigeria and Niger Republic.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
