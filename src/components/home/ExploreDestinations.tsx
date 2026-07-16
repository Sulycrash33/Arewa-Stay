import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { allRegions } from '@/lib/constants';
import { cityLandmarks, realPropertyPhotos } from '@/lib/stock-photos';
import { getTranslations } from '@/lib/i18n';

const FEATURED_CITIES = [
  'Abuja', 'Kano', 'Kaduna', 'Zaria', 'Katsina', 'Sokoto', 'Birnin Kebbi', 'Gusau',
  'Maiduguri', 'Damaturu', 'Bauchi', 'Azare', 'Gombe', 'Yola', 'Jalingo',
  'Minna', 'Ilorin', 'Lokoja', 'Makurdi', 'Jos', 'Lafia',
  'Niamey', 'Zinder', 'Maradi', 'Agadez', 'Argungu',
];

export default async function ExploreDestinations() {
  const t = await getTranslations();
  const supabase = await createClient();
  const { data } = await supabase.from('listings').select('city').eq('status', 'approved');
  const rows = (data ?? []) as Array<{ city: string }>;
  const counts = rows.reduce((acc: Record<string, number>, row: { city: string }) => {
    acc[row.city] = (acc[row.city] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalTowns = allRegions.reduce((sum, g) => sum + g.cities.length, 0);

  return (
    <section className="container mx-auto px-4 py-stack-lg">
      <div className="flex items-end justify-between mb-stack-md">
        <div>
          <span className="font-label-sm text-label-sm text-ochre-gold uppercase tracking-widest">{t.exploreByDestination}</span>
          <h2 className="font-headline-lg text-headline-lg text-m3-primary mt-1">{t.destinationsSubtitle}</h2>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            {totalTowns}+ towns across Northern Nigeria &amp; Niger Republic. Every home deserves a guest.
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
                src={cityLandmarks[city] ?? realPropertyPhotos.exteriors[i % realPropertyPhotos.exteriors.length]}
                alt={cityLandmarks[city] ? `${city} landmark` : `Representative property in ${city}`}
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
