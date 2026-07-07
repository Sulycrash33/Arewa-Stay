export type Currency = 'NGN' | 'XOF';
export type ListingStatus = 'pending' | 'approved' | 'rejected';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type DisputeStatus = 'open' | 'investigating' | 'closed';
export type PackageType = 'festival' | 'nomad';
export type UserRole = 'guest' | 'host' | 'admin';
export type HostTier = 'bako' | 'majidadin' | 'sarki';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  languages: string[];
  role: UserRole;
  phone: string | null;
  bio: string | null;
  host_tier: HostTier;
  completed_stays: number;
  avg_response_minutes: number | null;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string; // lucide-react icon name — resolved via the icon map at render time
}

export interface SpecialPackage {
  id: string;
  type: PackageType;
  name: string;
  description: string;
}

export interface Listing {
  id: string;
  host_id: string;
  title: string;
  description: string;
  type: string;
  state: string;
  city: string;
  address: string;
  lat: number | null;
  lng: number | null;
  price_per_night: number;
  currency: Currency;
  max_guests: number;
  status: ListingStatus;
  no_alcohol: boolean;
  women_only: boolean;
  family_only: boolean;
  has_zaure: boolean;
  detached_quarters: boolean;
  has_247_solar: boolean;
  has_borehole: boolean;
  created_at: string;

  // joined/aggregated fields, populated by the query helpers in lib/data.ts
  images?: string[];
  amenities?: Amenity[];
  special_packages?: SpecialPackage[];
  event_options?: string[];
  host?: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'languages'>;
  avg_rating?: number;
  review_count?: number;
}

export interface Review {
  id: string;
  listing_id: string;
  booking_id: string | null;
  author_id: string;
  rating: number;
  comment: string;
  created_at: string;
  author?: Pick<Profile, 'full_name' | 'avatar_url'>;
}

export interface Booking {
  id: string;
  listing_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_price: number;
  currency: Currency;
  status: BookingStatus;
  payment_reference: string | null;
  host_responded_at: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  listing_id: string | null;
  guest_id: string;
  host_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  read_at: string | null;
}

export interface Dispute {
  id: string;
  booking_id: string;
  opened_by: string;
  status: DisputeStatus;
  reason: string;
  created_at: string;
}
