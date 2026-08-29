-- Arewa Stay — migration 0013: security hardening
--
-- Closes the privilege-escalation gaps left by the original RLS policies.
-- The pattern across all of them: policies checked WHICH ROWS a user may
-- touch but never WHICH COLUMNS or WHICH VALUES, so any logged-in user
-- could, straight from the browser console:
--   1. promote themselves to admin            (profiles.role)
--   2. self-verify + claim top trust tier     (profiles.identity_verified / host_tier)
--   3. self-approve their own listing         (listings.status, bypassing moderation)
--   4. self-confirm their own booking         (bookings.status, bypassing Maraba)
--   5. tamper with price/currency/guests      (bookings.total_price etc.)
--   6. fake reviews without any booking       (reviews insert only checked author_id)
--   7. open disputes on anyone's booking      (disputes insert only checked opened_by)
--   8. self-approve their host verification   (host_verifications.status)
--   9. create conversations impersonating another user
--
-- Two complementary mechanisms are used:
--   - BEFORE triggers for column/transition protection (keeps admin flows
--     working unchanged, is_admin() is honoured),
--   - tighter WITH CHECK policies where the rule is about the new row's
--     relationship to other data (reviews, disputes, conversations).
--
-- Trusted server context: Supabase maintenance functions such as
-- expire_stale_bookings() and mark_completed_bookings() are SECURITY DEFINER
-- and run as `postgres`; the service role runs as `supabase_service_role`.
-- Those roles are exempt so background jobs keep working. API requests
-- always run as `authenticated` or `anon`, which are fully constrained.
--
-- Also fixes a real functional bug: messages.text is NOT NULL (0001) but
-- voice-note inserts (0010) never send text, so every voice note failed on
-- a schema built purely from these migration files.

-- ========== 1. messages: voice notes could never be inserted ==========
alter table messages alter column text drop not null;
alter table messages drop constraint if exists messages_text_or_audio;
alter table messages
  add constraint messages_text_or_audio
  check (text is not null or audio_url is not null);

-- ========== 2. profiles: privileged columns are admin-only ==========
create or replace function profiles_protect_privileged_columns()
returns trigger
language plpgsql
as $$
begin
  if current_user::text not in ('authenticated', 'anon') then
    return new; -- server-side context (maintenance functions, service role)
  end if;
  if is_admin() then
    return new; -- admin actions, e.g. approving a verification, stay allowed
  end if;
  if new.role is distinct from old.role
     or new.identity_verified is distinct from old.identity_verified
     or new.host_tier is distinct from old.host_tier
     or new.completed_stays is distinct from old.completed_stays
     or new.avg_response_minutes is distinct from old.avg_response_minutes
  then
    raise exception 'Privileged profile fields can only be changed by admins';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_privileged_trigger on profiles;
create trigger profiles_protect_privileged_trigger
  before update on profiles
  for each row execute function profiles_protect_privileged_columns();

-- ========== 3. listings: status is admin-only, new listings start pending ==========
create or replace function listings_protect_status()
returns trigger
language plpgsql
as $$
begin
  if current_user::text not in ('authenticated', 'anon') then
    return new;
  end if;
  if tg_op = 'INSERT' then
    if not is_admin() and new.status <> 'pending' then
      raise exception 'New listings must start as pending review';
    end if;
  else
    if not is_admin() and new.status is distinct from old.status then
      raise exception 'Only admins can change a listing''s status';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists listings_protect_status_trigger on listings;
create trigger listings_protect_status_trigger
  before insert or update on listings
  for each row execute function listings_protect_status();

-- ========== 4. listings: block deleting listings with active bookings or open disputes ==========
-- Otherwise a host under dispute could delete the listing, and the booking
-- and dispute rows would cascade away with it (evidence destroyed).
create or replace function listings_restrict_delete()
returns trigger
language plpgsql
as $$
begin
  if current_user::text not in ('authenticated', 'anon') then
    return old;
  end if;
  if exists (
    select 1 from bookings b
    where b.listing_id = old.id and b.status in ('pending', 'confirmed')
  ) or exists (
    select 1 from disputes d
    join bookings b on b.id = d.booking_id
    where b.listing_id = old.id and d.status <> 'closed'
  ) then
    raise exception 'This listing has active bookings or an open dispute and cannot be deleted';
  end if;
  return old;
end;
$$;

drop trigger if exists listings_restrict_delete_trigger on listings;
create trigger listings_restrict_delete_trigger
  before delete on listings
  for each row execute function listings_restrict_delete();

-- ========== 5. bookings: validate inserts (price, currency, guests, dates, status) ==========
-- The client-computed total_price is now bounded by the listing's real rate:
-- nights x price_per_night, scaled by the host's festival multiplier at most.
-- A tampered total (e.g. 1 naira) is rejected. Currency and status are
-- normalised from the listing so they cannot be spoofed either.
create or replace function bookings_validate_insert()
returns trigger
language plpgsql
as $$
declare
  l record;
  base numeric;
  lower_bound numeric;
  upper_bound numeric;
  nights int;
begin
  if current_user::text not in ('authenticated', 'anon') then
    return new;
  end if;

  select price_per_night, currency, max_guests, festival_price_multiplier, status
    into l
  from listings
  where id = new.listing_id;

  if not found or l.status <> 'approved' then
    raise exception 'This listing is not available for booking';
  end if;

  new.status := 'pending';              -- Maraba flow: requests start pending
  new.currency := l.currency;           -- currency follows the listing
  new.host_responded_at := null;
  new.payment_reference := null;        -- set only by a payment integration

  nights := (new.check_out - new.check_in);
  base := nights * l.price_per_night;
  lower_bound := base * least(coalesce(l.festival_price_multiplier, 1), 1) - 0.01;
  upper_bound := base * greatest(coalesce(l.festival_price_multiplier, 1), 1) + 0.01;

  if new.total_price < lower_bound or new.total_price > upper_bound then
    raise exception 'Invalid total_price for this stay (% nights at % per night)', nights, l.price_per_night;
  end if;

  if new.guests_count > l.max_guests then
    raise exception 'This stay allows up to % guests', l.max_guests;
  end if;

  if new.check_in < current_date then
    raise exception 'Check-in date cannot be in the past';
  end if;

  return new;
end;
$$;

drop trigger if exists bookings_validate_insert_trigger on bookings;
create trigger bookings_validate_insert_trigger
  before insert on bookings
  for each row execute function bookings_validate_insert();

-- ========== 6. bookings: restrict updates to the Maraba transitions ==========
-- Host (of the listing): pending -> confirmed/cancelled, confirmed -> cancelled.
-- Guest: pending/confirmed -> cancelled. Core fields are immutable.
create or replace function bookings_restrict_update()
returns trigger
language plpgsql
as $$
begin
  if current_user::text not in ('authenticated', 'anon') then
    return new;
  end if;

  if new.listing_id is distinct from old.listing_id
     or new.guest_id is distinct from old.guest_id
     or new.check_in is distinct from old.check_in
     or new.check_out is distinct from old.check_out
     or new.guests_count is distinct from old.guests_count
     or new.total_price is distinct from old.total_price
     or new.currency is distinct from old.currency
     or new.payment_reference is distinct from old.payment_reference
     or new.created_at is distinct from old.created_at
  then
    raise exception 'Booking core fields cannot be modified';
  end if;

  if exists (
    select 1 from listings l
    where l.id = new.listing_id and l.host_id = auth.uid()
  ) then
    if (old.status = 'pending' and new.status in ('confirmed', 'cancelled'))
       or (old.status = 'confirmed' and new.status = 'cancelled')
       or (old.status = new.status and new.host_responded_at is distinct from old.host_responded_at)
    then
      return new;
    end if;
    raise exception 'Hosts can only accept or decline a pending request, or cancel a confirmed booking';
  end if;

  if new.guest_id = auth.uid() then
    if old.status in ('pending', 'confirmed')
       and new.status = 'cancelled'
       and new.host_responded_at is not distinct from old.host_responded_at
    then
      return new;
    end if;
    raise exception 'Guests can only cancel their own booking';
  end if;

  raise exception 'Not allowed to modify this booking';
end;
$$;

drop trigger if exists bookings_restrict_update_trigger on bookings;
create trigger bookings_restrict_update_trigger
  before update on bookings
  for each row execute function bookings_restrict_update();

-- ========== 7. reviews: only real participants of a completed stay ==========
drop policy if exists "guests write reviews for own bookings" on reviews;
create policy "reviews require a completed booking" on reviews for insert
  with check (
    author_id = auth.uid()
    and booking_id is not null
    and exists (
      select 1 from bookings b
      join listings l on l.id = b.listing_id
      where b.id = booking_id
        and b.status = 'completed'
        and listing_id = b.listing_id
        and (
          (b.guest_id = auth.uid() and reviewee_id = l.host_id)
          or (l.host_id = auth.uid() and reviewee_id = b.guest_id)
        )
    )
  );

-- ========== 8. disputes: only participants, only on stays that happened ==========
drop policy if exists "booking participants open disputes" on disputes;
create policy "booking participants open disputes" on disputes for insert
  with check (
    opened_by = auth.uid()
    and exists (
      select 1 from bookings b
      join listings l on l.id = b.listing_id
      where b.id = booking_id
        and b.status in ('confirmed', 'completed')
        and (b.guest_id = auth.uid() or l.host_id = auth.uid())
    )
  );

-- ========== 9. conversations: the guest initiates, host must own the listing ==========
drop policy if exists "participants create conversations" on conversations;
create policy "guests initiate conversations" on conversations for insert
  with check (
    guest_id = auth.uid()
    and guest_id <> host_id
    and exists (
      select 1 from listings l
      where l.id = listing_id and l.host_id = host_id and l.host_id <> auth.uid()
    )
  );

-- ========== 10. host_verifications: submissions always start pending ==========
drop policy if exists "users submit own verification" on host_verifications;
create policy "users submit own verification" on host_verifications for insert
  with check (user_id = auth.uid() and status = 'pending');

-- ========== 11. contact_messages: admins can finally read the inbox ==========
drop policy if exists "admins read contact messages" on contact_messages;
create policy "admins read contact messages" on contact_messages for select
  using (is_admin());
