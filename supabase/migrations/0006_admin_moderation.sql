-- Admin moderation: lets users with profiles.role = 'admin' see and update
-- listings regardless of host_id, so pending listings can actually be
-- approved or rejected. Without this, every listing stays stuck in
-- 'pending' forever since only the owning host can update their own rows.

-- SECURITY DEFINER function to check admin status without triggering RLS
-- recursion (a plain "select role from profiles where id = auth.uid()"
-- inside a policy on profiles/listings can recurse back into itself).
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Listings: admins can see every listing (any status), not just approved/own.
create policy "admins see all listings" on listings for select
  using (is_admin());

-- Listings: admins can update any listing (approve/reject/status changes).
create policy "admins manage all listings" on listings for update
  using (is_admin());

-- Listing images: admins can see images for any listing while reviewing.
create policy "admins see all listing images" on listing_images for select
  using (is_admin());

-- Disputes: admins can see and manage all disputes (was flagged as TODO
-- in 0001_init.sql once an admin role existed to check against).
create policy "admins see all disputes" on disputes for select
  using (is_admin());

create policy "admins manage all disputes" on disputes for update
  using (is_admin());

-- Bookings: admins need visibility to investigate disputes.
create policy "admins see all bookings" on bookings for select
  using (is_admin());
