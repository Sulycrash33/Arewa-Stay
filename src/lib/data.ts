import { createClient } from '@/lib/supabase/server';
import type { Listing, Review, Booking } from '@/lib/types';

export { arewaStates } from '@/lib/constants';

const LISTING_SELECT = `
  *,
  listing_images ( url, sort_order ),
  listing_amenities ( amenities ( id, name, icon ) ),
  special_packages ( id, type, name, description ),
  event_options ( option_text ),
  host:profiles!listings_host_id_fkey ( id, full_name, avatar_url, languages )
`;

function shapeListing(row: any): Listing {
  return {
    ...row,
    images: (row.listing_images ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((i: any) => i.url),
    amenities: (row.listing_amenities ?? []).map((la: any) => la.amenities),
    special_packages: row.special_packages ?? [],
    event_options: (row.event_options ?? []).map((e: any) => e.option_text),
  };
}

export interface ListingFilters {
  state?: string;
  city?: string;
  minGuests?: number;
  womenOnly?: boolean;
  familyOnly?: boolean;
  checkIn?: string; // ISO date — excludes listings booked across this range
  checkOut?: string;
}

/** Public catalogue: only approved listings, with optional filters. */
export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const supabase = await createClient();
  let query = supabase.from('listings').select(LISTING_SELECT).eq('status', 'approved');

  if (filters.state) query = query.eq('state', filters.state);
  if (filters.city) query = query.eq('city', filters.city);
  if (filters.minGuests) query = query.gte('max_guests', filters.minGuests);
  if (filters.womenOnly) query = query.eq('women_only', true);
  if (filters.familyOnly) query = query.eq('family_only', true);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;

  let listings = (data ?? []).map(shapeListing);

  // Date-range availability filter: excludes listings with a conflicting booking.
  if (filters.checkIn && filters.checkOut) {
    const { data: conflicts } = await supabase
      .from('bookings')
      .select('listing_id')
      .in('status', ['pending', 'confirmed'])
      .lt('check_in', filters.checkOut)
      .gt('check_out', filters.checkIn);
    const blocked = new Set((conflicts ?? []).map((c) => c.listing_id));
    listings = listings.filter((l) => !blocked.has(l.id));
  }

  return listings;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('listings').select(LISTING_SELECT).eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? shapeListing(data) : null;
}

/** Host's own listings, any status — used on the host dashboard. */
export async function getHostListings(hostId: string): Promise<Listing[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('host_id', hostId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(shapeListing);
}

export async function getReviewsForListing(listingId: string): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*, author:profiles(full_name, avatar_url)')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Booked date ranges for a listing — feed straight into the calendar's disabled-days. */
export async function getBookedRanges(listingId: string): Promise<{ from: string; to: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('check_in, check_out')
    .eq('listing_id', listingId)
    .in('status', ['pending', 'confirmed']);
  if (error) throw error;
  return (data ?? []).map((b) => ({ from: b.check_in, to: b.check_out }));
}

/**
 * Create a booking. The DB's exclusion constraint (see migration 0001) is the
 * real source of truth for double-booking — this just surfaces that as a
 * friendly error instead of a raw Postgres exception.
 */
export async function createBooking(input: {
  listing_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  currency: 'NGN' | 'XOF';
}): Promise<{ booking: Booking | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('bookings').insert(input).select().single();

  if (error) {
    if (error.code === '23P01') {
      // exclusion_violation — the date range overlaps an existing booking
      return { booking: null, error: 'Those dates were just booked by someone else. Please pick different dates.' };
    }
    return { booking: null, error: error.message };
  }
  return { booking: data, error: null };
}
