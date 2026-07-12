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
