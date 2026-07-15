-- Lock down amenity lookup tables while preserving public catalogue reads.

alter table amenities enable row level security;
alter table listing_amenities enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'amenities'
      and policyname = 'amenities are publicly readable'
  ) then
    create policy "amenities are publicly readable" on amenities
      for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'listing_amenities'
      and policyname = 'listing amenities follow listing visibility'
  ) then
    create policy "listing amenities follow listing visibility" on listing_amenities
      for select using (
        exists (
          select 1 from listings l
          where l.id = listing_id
            and (l.status = 'approved' or l.host_id = auth.uid())
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'listing_amenities'
      and policyname = 'hosts manage own listing amenities'
  ) then
    create policy "hosts manage own listing amenities" on listing_amenities
      for all using (
        exists (
          select 1 from listings l
          where l.id = listing_id
            and l.host_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1 from listings l
          where l.id = listing_id
            and l.host_id = auth.uid()
        )
      );
  end if;
end
$$;
