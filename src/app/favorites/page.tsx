import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PropertyCard from '@/components/PropertyCard';

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth?tab=login');

  const { data } = await supabase
    .from('favorites')
    .select(`
      listing:listings (
        *,
        listing_images ( url, sort_order ),
        listing_amenities ( amenities ( id, name, icon ) )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const listings = (data ?? [])
    .map((row: any) => row.listing)
    .filter(Boolean)
    .map((l: any) => ({
      ...l,
      images: (l.listing_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((i: any) => i.url),
      amenities: (l.listing_amenities ?? []).map((la: any) => la.amenities),
    }));

  return (
    <main className="container mx-auto px-4 py-stack-lg">
      <h1 className="font-headline-lg text-headline-lg text-m3-primary mb-2">Saved Stays</h1>
      <p className="font-body-md text-on-surface-variant mb-stack-lg">{listings.length} {listings.length === 1 ? 'stay' : 'stays'} saved</p>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <PropertyCard key={listing.id} property={listing} />
          ))}
        </div>
      ) : (
        <p className="text-center font-body-lg text-body-lg text-on-surface-variant py-stack-lg">
          You haven&apos;t saved any stays yet. Tap the heart icon on a listing to save it here.
        </p>
      )}
    </main>
  );
}
