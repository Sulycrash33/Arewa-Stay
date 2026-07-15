import { createClient } from '@/lib/supabase/server';
import type { Listing, Review, Booking, Amenity, SpecialPackage, Profile } from '@/lib/types';

export { arewaStates, arewaCities, allRegions } from '@/lib/constants';

const LISTING_SELECT = `
  *,
  listing_images ( url, sort_order ),
  listing_amenities ( amenities ( id, name, icon ) ),
  special_packages ( id, type, name, description ),
  event_options ( option_text ),
  host:profiles!listings_host_id_fkey ( id, full_name, avatar_url, languages, identity_verified, host_tier )
`;

/** Raw shape returned by Supabase for the LISTING_SELECT query above.
 *  Mirrors the joined nested structure so shapeListing() stays type-safe. */
interface RawListingImage { url: string; sort_order: number }
interface RawListingAmenity { amenities: Amenity }
interface RawEventOption { option_text: string }
interface RawListingHost extends Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'languages' | 'identity_verified' | 'host_tier'> {}

interface RawListingRow extends Omit<Listing, 'images' | 'amenities' | 'special_packages' | 'event_options' | 'host'> {
  listing_images: RawListingImage[] | null;
  listing_amenities: RawListingAmenity[] | null;
  special_packages: SpecialPackage[] | null;
  event_options: RawEventOption[] | null;
  host: RawListingHost | null;
}

function shapeListing(row: RawListingRow): Listing {
  const { listing_images, listing_amenities, special_packages, event_options, host, ...rest } = row;
  return {
    ...rest,
    images: (listing_images ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.url),
    amenities: (listing_amenities ?? []).map((la) => la.amenities),
    special_packages: special_packages ?? [],
    event_options: (event_options ?? []).map((e) => e.option_text),
    host: host ?? undefined,
  };
}

export interface ListingFilters {
  state?: string;
  city?: string;
  minGuests?: number;
  womenOnly?: boolean;
  familyOnly?: boolean;
  hasZaure?: boolean;
  detachedQuarters?: boolean;
  has247Solar?: boolean;
  hasBorehole?: boolean;
  checkIn?: string; // ISO date — excludes listings booked across this range
  checkOut?: string;
}

/** Average nightly rate by city, from real approved listings. Falls back to
 * sensible defaults by tier (major hub / secondary town) where no listings
 * exist yet, so the earnings estimator has something honest to show. */
export async function getAverageRatesByCity(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase.from('listings').select('city, price_per_night').eq('status', 'approved');
  const sums: Record<string, { total: number; count: number }> = {};
  (data ?? []).forEach((row) => {
    if (!sums[row.city]) sums[row.city] = { total: 0, count: 0 };
    sums[row.city].total += Number(row.price_per_night);
    sums[row.city].count += 1;
  });
  const result: Record<string, number> = {};
  Object.entries(sums).forEach(([city, { total, count }]) => {
    result[city] = Math.round(total / count);
  });
  return result;
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
  if (filters.hasZaure) query = query.eq('has_zaure', true);
  if (filters.detachedQuarters) query = query.eq('detached_quarters', true);
  if (filters.has247Solar) query = query.eq('has_247_solar', true);
  if (filters.hasBorehole) query = query.eq('has_borehole', true);

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

/** Full booking detail for the host's review screen — booking + listing + guest profile. */
export async function getBookingForReview(bookingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      listing:listings ( id, title, city, state, host_id ),
      guest:profiles!bookings_guest_id_fkey ( id, full_name, avatar_url, host_tier, completed_stays, phone )
    `)
    .eq('id', bookingId)
    .single();
  if (error) throw error;
  return data;
}

/** Host responds to a booking request: Maraba (accept) or Nemi Wani (decline/redirect). */
export async function respondToBooking(bookingId: string, action: 'accept' | 'decline') {
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update({
      status: action === 'accept' ? 'confirmed' : 'cancelled',
      host_responded_at: new Date().toISOString(),
    })
    .eq('id', bookingId);
  if (error) throw error;
}

/** Host verification status + trust-tier progress, for the verification stepper screen. */
export async function getHostVerificationStatus(userId: string) {
  const supabase = await createClient();
  const [{ data: profile, error: profileError }, { data: verifications, error: verError }] = await Promise.all([
    supabase.from('profiles').select('host_tier, completed_stays, avg_response_minutes').eq('id', userId).single(),
    supabase.from('host_verifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ]);
  if (profileError) throw profileError;
  if (verError) throw verError;
  return { profile, latestVerification: verifications?.[0] ?? null };
}

/** Submit for host verification. Note: we never store a raw NIN/BVN number —
 * only the fact that a submission happened, pending review by a liaison or a
 * licensed identity-verification provider integration. */
export async function submitHostVerification(userId: string, idType: 'NIN' | 'BVN') {
  const supabase = await createClient();
  const { error } = await supabase.from('host_verifications').insert({
    user_id: userId,
    notes: `${idType} submitted for verification`,
    status: 'pending',
  });
  if (error) throw error;
}

/** All listings for the admin moderation queue, optionally filtered by status.
 * Relies on the "admins see all listings" RLS policy (0006_admin_moderation.sql) —
 * a non-admin caller will just get back their own listings per the normal policy. */
export async function getListingsForAdmin(status?: 'pending' | 'approved' | 'rejected'): Promise<Listing[]> {
  const supabase = await createClient();
  let query = supabase.from('listings').select(LISTING_SELECT).order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(shapeListing);
}

/** Update the cultural/infrastructure toggles on a listing (property wizard step). */
export async function updateListingCulturalFeatures(listingId: string, features: {
  has_zaure?: boolean;
  detached_quarters?: boolean;
  has_247_solar?: boolean;
  has_borehole?: boolean;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('listings').update(features).eq('id', listingId);
  if (error) throw error;
}
