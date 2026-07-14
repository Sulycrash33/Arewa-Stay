-- Two-way reviews: reviewee_id records WHO the review is about (previously
-- reviews only ever pointed at a listing, implicitly guest-reviewing-host).
-- Table was empty at migration time, so NOT NULL applied directly.
alter table reviews add column reviewee_id uuid references profiles(id);
alter table reviews alter column reviewee_id set not null;
alter table reviews add constraint reviews_one_per_author_per_booking unique (booking_id, author_id);

-- Mirrors expire_stale_bookings(): flips confirmed bookings whose checkout
-- has passed into 'completed', so review/dispute eligibility has a real
-- status to check rather than comparing dates ad hoc everywhere it's needed.
create or replace function mark_completed_bookings()
returns void as $$
begin
  update bookings
  set status = 'completed'
  where status = 'confirmed'
    and check_out < now();
end;
$$ language plpgsql security definer;

-- Community Liaison Trust Network, formalized: real named local reps an
-- admin can assign, instead of free-text fields nothing ever populated.
create table liaisons (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  state text not null,
  cities text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table liaisons enable row level security;
create policy "admins manage liaisons" on liaisons for all using (is_admin());
create policy "liaisons are readable by authenticated users" on liaisons for select using (auth.uid() is not null);

alter table host_verifications add column liaison_id uuid references liaisons(id);

-- Verified-host badge: a denormalized flag on profiles (already publicly
-- readable) rather than exposing host_verifications rows publicly, which
-- would need new RLS surface and could leak liaison contact info. Set by
-- the admin verification-approval action.
alter table profiles add column identity_verified boolean not null default false;

-- Admin needs UPDATE on other users' profiles to set identity_verified on
-- approval (previously only self-update existed).
create policy "admins update any profile" on profiles for update using (is_admin());
