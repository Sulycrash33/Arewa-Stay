-- Arewa Stay — migration 0005: wishlist/favorites
create table favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

alter table favorites enable row level security;
create policy "users manage own favorites" on favorites for all using (user_id = auth.uid());
