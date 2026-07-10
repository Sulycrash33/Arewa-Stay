import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { allRegions } from '@/lib/constants';
import { architecturePhotos } from '@/lib/stock-photos';

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
            <div className="aspect-[4/3] relative">
              <Image
                src={architecturePhotos[i % architecturePhotos.length]}
                alt={`Traditional Northern Nigerian architecture, representative of ${city}`}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
