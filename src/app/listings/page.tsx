import { getListings } from '@/lib/data';
import PropertyCard from '@/components/PropertyCard';
import { allRegions } from '@/lib/constants';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; state?: string; womenOnly?: string; familyOnly?: string; hasZaure?: string }>;
}) {
  const params = await searchParams;
  const listings = await getListings({
    city: params.city,
    state: params.state,
    womenOnly: params.womenOnly === 'true',
    familyOnly: params.familyOnly === 'true',
    hasZaure: params.hasZaure === 'true',
  });

  const filterLink = (key: string, value: string, label: string, active: boolean) => (
    <Link
      href={`/listings?${new URLSearchParams({ ...params, [key]: active ? '' : value }).toString()}`}
      className={cn(
        'font-label-md text-label-md px-4 py-1.5 rounded-full border transition-colors whitespace-nowrap',
        active ? 'bg-primary-container text-on-primary border-primary-container' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
      )}
    >
      {label}
    </Link>
  );

  return (
    <main className="container mx-auto px-4 py-stack-lg">
      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">
          {params.city ? `Stays in ${params.city}` : 'All Stays'}
        </h1>
        <p className="font-body-md text-on-surface-variant">{listings.length} {listings.length === 1 ? 'stay' : 'stays'} found across Northern Nigeria &amp; Niger Republic</p>
      </div>

      {/* Cultural/infrastructure filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-stack-md">
        {filterLink('womenOnly', 'true', 'Women-only', params.womenOnly === 'true')}
        {filterLink('familyOnly', 'true', 'Family-only', params.familyOnly === 'true')}
        {filterLink('hasZaure', 'true', 'Zaure reception', params.hasZaure === 'true')}
      </div>

      {/* City pills, grouped by state — covers every major state/town across
          Northern Nigeria and Niger Republic, not just a handful of big cities.
          The goal: give every host's town a real chance to be searched for. */}
      <div className="space-y-stack-sm mb-stack-lg">
        <Link
          href="/listings"
          className={cn(
            'inline-block font-label-md text-label-md px-4 py-1.5 rounded-full border transition-colors mr-2 mb-2',
            !params.city ? 'bg-primary-container text-on-primary border-primary-container' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          )}
        >
          All Locations
        </Link>
        {allRegions.map((group) => (
          <div key={group.state} className="flex flex-wrap items-center gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant/70 w-32 shrink-0">{group.state}</span>
            {group.cities.map((city) => (
              <Link
                key={city}
                href={`/listings?${new URLSearchParams({ ...params, city }).toString()}`}
                className={cn(
                  'font-label-md text-label-md px-3 py-1 rounded-full border transition-colors whitespace-nowrap text-sm',
                  params.city === city ? 'bg-primary-container text-on-primary border-primary-container' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                )}
              >
                {city}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <PropertyCard key={listing.id} property={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-stack-lg">
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            No stays match these filters yet — once hosts start onboarding, their approved listings will show up here.
          </p>
        </div>
      )}
    </main>
  );
}
