import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MapPin } from 'lucide-react';
import { allRegions } from '@/lib/constants';

// Feature the biggest hubs first, but the full expanded list (all 19 Northern
// Nigeria states + FCT, plus Niger Republic) is reachable via "View all" on
// the /listings page — so every host's town has a real path to visibility,
// not just the handful of cities that fit on a homepage grid.
const FEATURED_CITIES = [
  'Abuja', 'Kano', 'Kaduna', 'Zaria', 'Katsina', 'Sokoto', 'Birnin Kebbi', 'Gusau',
  'Maiduguri', 'Damaturu', 'Bauchi', 'Azare', 'Gombe', 'Yola', 'Jalingo',
  'Minna', 'Ilorin', 'Lokoja', 'Makurdi', 'Jos', 'Lafia',
  'Niamey', 'Zinder', 'Maradi', 'Agadez', 'Argungu',
];

export default async function ExploreDestinations() {
  const supabase = await createClient();
  const { data } = await supabase.from('listings').select('city').eq('status', 'approved');
  const counts = (data ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.city] = (acc[row.city] ?? 0) + 1;
    return acc;
  }, {});

  const totalTowns = allRegions.reduce((sum, g) => sum + g.cities.length, 0);

  return (
    <section className="container mx-auto px-4 py-stack-lg">
      <div className="flex items-end justify-between mb-stack-md">
        <div>
          <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-widest">Explore by Destination</span>
          <h2 className="font-headline-lg text-headline-lg text-m3-primary mt-1">Discover iconic cities and hidden gems.</h2>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            {totalTowns}+ towns across Northern Nigeria &amp; Niger Republic — every home deserves a guest.
          </p>
        </div>
        <Link href="/listings" className="hidden md:flex items-center gap-1 font-label-md text-label-md text-primary-container hover:underline shrink-0">
          View all {totalTowns}+ destinations →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {FEATURED_CITIES.map((city, i) => (
          <Link
            key={city}
            href={`/listings?city=${encodeURIComponent(city)}`}
            className="group rounded-tubali overflow-hidden border border-outline-variant/30 hover:shadow-tubali transition-shadow"
          >
            <div
              className="aspect-[4/3] flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, hsl(${(i * 37) % 360} 35% 30%), hsl(${(i * 37 + 40) % 360} 30% 45%))` }}
            >
              <MapPin className="h-8 w-8 text-white/60" />
            </div>
            <div className="p-2 bg-surface-container-lowest">
              <h3 className="font-title-md text-sm text-on-surface">{city}</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{counts[city] ?? 0} properties</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-stack-md md:hidden">
        <Link href="/listings" className="font-label-md text-label-md text-primary-container hover:underline">
          View all {totalTowns}+ destinations →
        </Link>
      </div>
    </section>
  );
}
