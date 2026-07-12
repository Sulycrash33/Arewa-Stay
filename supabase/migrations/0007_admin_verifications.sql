-- Extends 0006_admin_moderation.sql's is_admin() pattern to host_verifications,
-- which that migration didn't cover. Without this, admins have no way to
-- see or approve/revoke pending NIN/BVN verification submissions.

create policy "admins see all host_verifications" on host_verifications for select
  using (is_admin());

create policy "admins manage all host_verifications" on host_verifications for update
  using (is_admin());
