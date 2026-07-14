-- Adds host-controlled festival pricing. Overlap detection with
-- Ramadan/Eid al-Fitr/Eid al-Adha is computed client- and server-side via
-- src/lib/hijri.ts (tabular Islamic calendar — a calculated approximation,
-- not a moon-sighting confirmation).
alter table listings
  add column festival_price_multiplier numeric not null default 1.0;

comment on column listings.festival_price_multiplier is 'Multiplier applied to price_per_night when a stay overlaps Ramadan/Eid al-Fitr/Eid al-Adha. 1.0 = no change.';
