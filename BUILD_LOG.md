# Arewa Stay — Build Log

**Read this file first, before touching any code.** It's the single source of
truth for what's actually built vs. assumed. Update it after every meaningful
chunk of work: what changed, what's mid-flight, exact next step.

---

## 2026-07-12 — Audit + Admin Moderation Dashboard

### Audit correction (important)
Prior assumption was "listing wizard doesn't exist." **False.** Verified by
reading the actual repo: all 6 wizard steps
(`/host/listings/new` → `photos` → `cultural-features` → `amenities` →
`pricing` → `review`) are real, wired to Supabase, and functional. A host can
create a listing end-to-end today. Do not rebuild this.

### What was actually missing (fixed this session)
No admin route existed anywhere. Every listing a host created was permanently
stuck at `status: 'pending'` because RLS only let the owning host update their
own rows — nothing could ever approve a listing. **This was the real blocker**,
not the wizard.

### Built this session
1. `supabase/migrations/0006_admin_moderation.sql`
   - `is_admin()` SECURITY DEFINER helper (checks `profiles.role = 'admin'`,
     avoids RLS recursion)
   - RLS policies: admins can select/update all `listings`, select
     `listing_images`, select/update `disputes`, select `bookings`
   - **NOT YET RUN against the live Supabase project** — needs to be applied
     (Supabase dashboard SQL editor, or `supabase db push` once linked)
2. `src/app/admin/layout.tsx` — guards the whole `/admin` section; redirects
   to `/` if `profiles.role !== 'admin'`
3. `src/app/admin/listings/page.tsx` — moderation queue with
   pending/approved/rejected tabs (`?status=`)
4. `src/components/admin/ListingModerationCard.tsx` — approve/reject buttons,
   client-side Supabase update, `router.refresh()` after action
5. `src/lib/data.ts` — added `getListingsForAdmin(status?)` helper
6. `npx tsc --noEmit` passes clean, no type errors

### To actually use this
1. Run `0006_admin_moderation.sql` against the Supabase project
2. Manually set your own `profiles.role` to `'admin'` in the Supabase
   dashboard (no UI for this yet — one-time bootstrap)
3. Visit `/admin/listings`

### Explicitly NOT done yet (don't assume otherwise)
- No link to `/admin/listings` in any nav — admins have to type the URL
- No email/notification to host when a listing is approved/rejected
- No rejection reason field — reject is a bare status flip right now
- Migration not yet applied to the live DB (see above)

### Next up (must-ship tier, in order)
1. **Apply the migration + bootstrap an admin** (5 min, unblocks testing
   everything else)
2. **Paystack integration** — booking payment + host payout flow
3. **Messaging UI** — `conversations`/`messages` tables exist in schema,
   zero UI for either
4. **ToS / Privacy Policy pages** — real legal exposure right now, genuinely
   don't exist anywhere in the app

### Full prioritization (from the 2026-07-12 planning conversation)
| Tier | Items |
|---|---|
| Must-ship | Listing wizard ✅ done · Admin moderation ✅ done this session · Paystack + payout · Messaging UI · ToS/Privacy |
| Ship right after | Verified badge tied to real approval · host→guest reviews · dispute/protection policy · real NIN/BVN check |
| Moat (post must-ship) | Community Liaison Trust Network · USSD booking fallback · Hijri-aware calendar · voice-note messaging |
| Growth layer | Referral program · WhatsApp notifications · town-level social proof |

---

## 2026-07-12 (later same day) — Parallel-session reconciliation + rest of admin dashboard

### What happened
This session (running concurrently with the one that wrote the entry above)
independently built the same admin-moderation gap from scratch, not having
seen this file yet. Both sessions diverged from commit `7d37485`. Reconciled
via `git merge` rather than discarding either side:

- **Kept from the other session**: `is_admin()` SECURITY DEFINER helper
  (`0006_admin_moderation.sql`) as the canonical admin-check pattern — more
  robust against RLS recursion than this session's original inline
  `exists(select ... from profiles ...)` checks. Also kept their
  `/admin/listings` page (tabbed pending/approved/rejected via `?status=`)
  and `ListingModerationCard.tsx` over this session's inline version —
  genuinely better UX pattern.
- **Kept from this session**: the admin layout's sidebar nav (covers
  Overview/Listings/Verifications/Disputes — the other session had only
  built Listings), and three new pages that didn't exist on either side
  before: `/admin` (overview with live counts), `/admin/verifications`
  (approve/revoke NIN/BVN submissions), `/admin/disputes` (open →
  investigating → closed workflow).
- Live database was reconciled to match: dropped this session's
  already-applied inline-exists policies that collided by name with the
  incoming migration, ran `0006_admin_moderation.sql` cleanly, added
  `0007_admin_verifications.sql` extending the same `is_admin()` pattern to
  `host_verifications` (the one table neither side's migration originally
  covered).

### Lesson for future sessions
**Read this file's most recent entries before starting work**, especially
before rebuilding anything that sounds like it might already exist. Check
`git log` too — a prior session's summary in a chat may be stale if another
session has pushed since.

### Also built this session (separate from the reconciliation above)
- Host earnings estimator on `/become-a-host` — real interactive nights
  slider + city/bedroom selector, computed against actual average
  `price_per_night` per city from approved listings (`getAverageRatesByCity`
  in `lib/data.ts`), falling back to a flat default for towns with no
  listings yet. Visual is an original stylized price-bubble cluster (Tubali
  cards, henna-pattern background) rather than a real map embed — no Google
  Maps API key/billing dependency needed.
- "Join hosts across the North" trust section + "A community liaison can
  help you get started" CTA on `/become-a-host` (Arewa-styled equivalents of
  Airbnb's "Join millions of hosts" / co-host sections).
- Fixed two real, previously-silent RLS bugs found while building the
  amenities step of the listing wizard: `amenities` and `listing_amenities`
  both had RLS enabled with **zero policies** since `0001_init.sql` — meaning
  they've silently denied all reads/writes since the schema was created.
  Every listing's amenities join has been returning empty this whole time
  until this fix.

### Explicitly NOT done yet
- No rejection-reason field on listing rejection (bare status flip)
- No email/notification to host on approve/reject
- Admin bootstrap is still fully manual (`update profiles set role='admin'
  where id='...'` via Supabase SQL editor — no self-service or invite flow)
- Payments, messaging UI, ToS/Privacy pages — unchanged from the list above

---

## 2026-07-12 (later still) — Messaging UI

### What was built
Real-time host-guest messaging, previously just unused schema:
- `/dashboard/messages` — conversation list (last message preview, unread dot)
- `/dashboard/messages/[conversationId]` — live thread. Uses a Supabase
  Realtime `postgres_changes` channel subscription (not polling) to receive
  new messages instantly.
- `MessageHostButton` on listing detail pages — finds or creates a
  `conversations` row for (listing, guest, host), then routes to the thread.
- Small cultural touch: a row of time-of-day greeting chips above the
  composer (morning/afternoon/evening variants) that quick-send on tap —
  cheap to build, matches the "voice-first, low-friction" design intent from
  the original directive without needing actual voice notes yet.

### Real bug found and fixed
The `messages` table was never added to the `supabase_realtime` publication
(`0008_realtime_messages.sql`). Without this, `.channel().on('postgres_changes',
...)` subscribes without error and just **never fires** — a silent failure
that would have looked like "messaging is broken" with zero error output to
debug from. If any *other* table gets a Realtime subscription added later,
check this publication first.

### Explicitly NOT done yet
- No push/email notification when a new message arrives while offline
- No voice notes (schema doesn't have `audio_url`/`duration_sec` columns —
  the original directive's Prisma spec had these, but we're on raw
  Postgres/Supabase, not Prisma; would need its own migration)
- No typing indicators / online presence
- Payments, ToS/Privacy pages — still not started

---
