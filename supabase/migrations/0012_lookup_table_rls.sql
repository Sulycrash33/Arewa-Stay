-- Arewa Stay — migration 0012
-- Closes a security gap flagged in code review: the amenities and
-- listing_amenities tables were created in 0001_init.sql without RLS
-- policies. While amenities is a read-only lookup table, leaving it
-- without an explicit SELECT policy means the table is "wide open" —
-- any role can read it, and listing_amenities (a junction table) had
-- no policies at all, meaning hosts could not insert/delete rows via
-- the standard RLS path and anyone could read the junction.
--
-- This migration enables RLS on both and adds the minimum sensible
-- policies: public read on amenities, read-through on
-- listing_amenities (visibility follows the parent listing), and
-- host management of their own listing's amenity links.

-- ========== amenities: public read-only lookup ==========
alter table amenities enable row level security;

create policy "amenities are publicly readable"
  on amenities for select using (true);

-- ========== listing_amenities: visibility follows parent listing ==========
alter table listing_amenities enable row level security;

create policy "listing amenities follow listing visibility"
  on listing_amenities for select
  using (
    exists (
      select 1 from listings l
      where l.id = listing_id
        and (l.status = 'approved' or l.host_id = auth.uid())
    )
  );

create policy "hosts manage own listing amenities"
  on listing_amenities for all
  using (
    exists (
      select 1 from listings l
      where l.id = listing_id and l.host_id = auth.uid()
    )
  );
