-- Arewa Stay — migration 0002
-- Adds: authentic privacy/infrastructure listing filters, a consent-first
-- booking flow (host explicitly accepts or redirects, with auto-expiry
-- instead of instant-book), and host trust tiers.

-- ========== LISTING: PRIVACY & INFRASTRUCTURE FILTERS ==========
alter table listings
  add column has_zaure boolean not null default false,          -- traditional reception anteroom — lets visitors/couriers reach the compound without entering the family's private inner quarters
  add column detached_quarters boolean not null default false,  -- fully separate structure from the main house, useful for mixed-group bookings
  add column has_247_solar boolean not null default false,      -- verified standalone solar/inverter power, independent of grid outages
  add column has_borehole boolean not null default false;       -- independent groundwater supply, independent of municipal water delivery

comment on column listings.has_zaure is 'Traditional Hausa reception anteroom — allows guests/couriers to be received without entering the family''s private inner compound.';

-- ========== HOST TRUST TIERS ==========
create type host_tier as enum ('bako', 'majidadin', 'sarki');
-- bako: default / new host. majidadin: >=15 completed stays, fast response time, unlocks faster payout.
-- sarki: top-tier, field-verified, priority visibility. Purely a display/gamification layer over `profiles`.

alter table profiles
  add column host_tier host_tier not null default 'bako',
  add column completed_stays int not null default 0,
  add column avg_response_minutes int;

-- ========== BOOKING: CONSENT-FIRST FLOW ==========
-- Replaces implicit instant-book semantics: a new booking starts as a request
-- the host must actively accept ("maraba") or decline/redirect ("nemi wani").
-- If the host doesn't respond within 12 hours, it auto-expires and releases
-- the guest's hold rather than silently sitting unconfirmed.
alter table bookings
  add column host_responded_at timestamptz;
-- Response deadline is simply created_at + 12 hours, computed where needed
-- (in the expiry function below and in the app) rather than stored, since
-- Postgres generated columns can't reference now()-dependent expressions.

-- A tiny helper the app (or a scheduled Supabase Edge Function / pg_cron job)
-- can call periodically to expire stale requests.
create or replace function expire_stale_bookings()
returns void as $$
begin
  update bookings
  set status = 'cancelled'
  where status = 'pending'
    and host_responded_at is null
    and created_at + interval '12 hours' < now();
end;
$$ language plpgsql security definer;

-- ========== HOST VERIFICATION (community liaison, not raw NIN/BVN storage) ==========
-- Note: real NIN/BVN verification requires a licensed identity-verification
-- provider (e.g. Paystack Identity, Youverify, NIBSS-integrated services) —
-- this table tracks the *outcome* of that process, it does not store raw
-- national ID numbers itself.
create type verification_status as enum ('pending', 'approved', 'revoked');

create table host_verifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  liaison_name text,        -- e.g. a community leader / market head who vouches for the host
  liaison_contact text,
  notes text,
  status verification_status not null default 'pending',
  created_at timestamptz not null default now()
);

alter table host_verifications enable row level security;
create policy "users see own verification" on host_verifications for select using (user_id = auth.uid());
create policy "users submit own verification" on host_verifications for insert with check (user_id = auth.uid());
