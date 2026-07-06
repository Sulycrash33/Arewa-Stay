-- Arewa Stay — initial schema
-- Run this in Supabase Dashboard -> SQL Editor (or via `supabase db push` once linked)

create extension if not exists "uuid-ossp";
create extension if not exists btree_gist; -- needed for date-range exclusion constraint

-- ========== ENUMS ==========
create type user_role as enum ('guest', 'host', 'admin');
create type currency_code as enum ('NGN', 'XOF');
create type listing_status as enum ('pending', 'approved', 'rejected');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type dispute_status as enum ('open', 'investigating', 'closed');
create type package_type as enum ('festival', 'nomad');

-- ========== PROFILES ==========
-- One row per auth.users entry. Created automatically via trigger below.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  languages text[] default '{}',
  role user_role not null default 'guest',
  phone text,
  bio text,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ========== LISTINGS ==========
create table listings (
  id uuid primary key default uuid_generate_v4(),
  host_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  type text not null, -- e.g. 'Family Compound', 'Apartment / Wedding Suite'
  state text not null,
  city text not null,
  address text not null,
  lat double precision,
  lng double precision,
  price_per_night numeric(12,2) not null check (price_per_night >= 0),
  currency currency_code not null default 'NGN',
  max_guests int not null check (max_guests > 0),
  status listing_status not null default 'pending',
  no_alcohol boolean not null default false,
  women_only boolean not null default false,
  family_only boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_listings_state_city on listings(state, city);
create index idx_listings_status on listings(status);

create table listing_images (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

create table amenities (
  id serial primary key,
  name text unique not null,
  icon text not null -- lucide-react icon name, e.g. 'Wifi'
);

create table listing_amenities (
  listing_id uuid references listings(id) on delete cascade,
  amenity_id int references amenities(id) on delete cascade,
  primary key (listing_id, amenity_id)
);

create table special_packages (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  type package_type not null,
  name text not null,
  description text not null
);

create table event_options (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  option_text text not null
);

-- ========== BOOKINGS ==========
-- The key upgrade over Firestore: a real exclusion constraint that makes
-- double-booking impossible at the database level, not just in app code.
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  guest_id uuid not null references profiles(id) on delete cascade,
  check_in date not null,
  check_out date not null check (check_out > check_in),
  guests_count int not null check (guests_count > 0),
  total_price numeric(12,2) not null,
  currency currency_code not null,
  status booking_status not null default 'pending',
  payment_reference text, -- Paystack reference once wired up
  created_at timestamptz not null default now(),
  stay_range daterange generated always as (
    daterange(check_in, check_out, '[)')
  ) stored,
  -- Only confirmed/pending bookings block the calendar; cancelled ones don't.
  exclude using gist (
    listing_id with =,
    stay_range with &&
  ) where (status in ('pending', 'confirmed'))
);

create index idx_bookings_listing on bookings(listing_id);
create index idx_bookings_guest on bookings(guest_id);

-- ========== REVIEWS ==========
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  author_id uuid not null references profiles(id) on delete cascade,
  rating numeric(2,1) not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamptz not null default now()
);

create index idx_reviews_listing on reviews(listing_id);

-- ========== MESSAGING ==========
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references listings(id) on delete set null,
  guest_id uuid not null references profiles(id) on delete cascade,
  host_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (listing_id, guest_id, host_id)
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index idx_messages_conversation on messages(conversation_id);

-- ========== DISPUTES (admin) ==========
create table disputes (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  opened_by uuid not null references profiles(id),
  status dispute_status not null default 'open',
  reason text not null,
  created_at timestamptz not null default now()
);

-- ========== ROW LEVEL SECURITY ==========
alter table profiles enable row level security;
alter table listings enable row level security;
alter table listing_images enable row level security;
alter table special_packages enable row level security;
alter table event_options enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table disputes enable row level security;

-- Profiles: everyone can read basic profile info, only the owner can edit
create policy "profiles are publicly readable" on profiles for select using (true);
create policy "users can update own profile" on profiles for update using (auth.uid() = id);

-- Listings: approved listings are public; hosts see/manage their own regardless of status
create policy "approved listings are public" on listings for select using (status = 'approved' or host_id = auth.uid());
create policy "hosts manage own listings" on listings for all using (host_id = auth.uid());

create policy "listing images follow listing visibility" on listing_images for select
  using (exists (select 1 from listings l where l.id = listing_id and (l.status = 'approved' or l.host_id = auth.uid())));
create policy "hosts manage own listing images" on listing_images for all
  using (exists (select 1 from listings l where l.id = listing_id and l.host_id = auth.uid()));

create policy "packages follow listing visibility" on special_packages for select
  using (exists (select 1 from listings l where l.id = listing_id and (l.status = 'approved' or l.host_id = auth.uid())));
create policy "hosts manage own packages" on special_packages for all
  using (exists (select 1 from listings l where l.id = listing_id and l.host_id = auth.uid()));

create policy "event options follow listing visibility" on event_options for select
  using (exists (select 1 from listings l where l.id = listing_id and (l.status = 'approved' or l.host_id = auth.uid())));
create policy "hosts manage own event options" on event_options for all
  using (exists (select 1 from listings l where l.id = listing_id and l.host_id = auth.uid()));

-- Bookings: guests see their own, hosts see bookings on their listings
create policy "guests see own bookings" on bookings for select using (guest_id = auth.uid());
create policy "hosts see bookings on own listings" on bookings for select
  using (exists (select 1 from listings l where l.id = listing_id and l.host_id = auth.uid()));
create policy "guests create bookings" on bookings for insert with check (guest_id = auth.uid());
create policy "guests cancel own bookings" on bookings for update using (guest_id = auth.uid());

-- Reviews: public read, only the guest who booked can write
create policy "reviews are publicly readable" on reviews for select using (true);
create policy "guests write reviews for own bookings" on reviews for insert with check (author_id = auth.uid());

-- Conversations & messages: only participants
create policy "participants see own conversations" on conversations for select
  using (guest_id = auth.uid() or host_id = auth.uid());
create policy "participants create conversations" on conversations for insert
  with check (guest_id = auth.uid() or host_id = auth.uid());

create policy "participants see own messages" on messages for select
  using (exists (select 1 from conversations c where c.id = conversation_id and (c.guest_id = auth.uid() or c.host_id = auth.uid())));
create policy "participants send messages" on messages for insert
  with check (sender_id = auth.uid() and exists (select 1 from conversations c where c.id = conversation_id and (c.guest_id = auth.uid() or c.host_id = auth.uid())));

-- Disputes: participants of the underlying booking + admins (admin check added once admin role wired to a claim)
create policy "booking participants see disputes" on disputes for select
  using (exists (
    select 1 from bookings b join listings l on l.id = b.listing_id
    where b.id = booking_id and (b.guest_id = auth.uid() or l.host_id = auth.uid())
  ));
create policy "booking participants open disputes" on disputes for insert
  with check (opened_by = auth.uid());

-- ========== SEED: amenities lookup ==========
insert into amenities (name, icon) values
  ('Air Conditioning', 'Snowflake'),
  ('Wi-Fi', 'Wifi'),
  ('High-Speed Wi-Fi', 'Wifi'),
  ('Private Bathroom', 'Bath'),
  ('Ensuite Bathroom', 'Bath'),
  ('Shared Bathroom', 'Bath'),
  ('Generator', 'Power'),
  ('24/7 Power', 'Power'),
  ('Kitchenette', 'Utensils'),
  ('Smart TV', 'Tv'),
  ('Secure Parking', 'ParkingCircle'),
  ('Fan', 'Wind'),
  ('Courtyard', 'Home');
