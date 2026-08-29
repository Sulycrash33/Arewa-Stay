# Arewa Stay

A BnB-style marketplace for Northern Nigeria and the Sahel (Niger Republic) , 
built with Next.js 15, Supabase (Postgres + Auth), Tailwind, and the shared
"Kofar Mata" design system used across Sulycrash33 projects.

## Stack
- Next.js 15 (App Router)
- Supabase, Postgres, Auth, RLS
- Tailwind CSS + shadcn/ui primitives
- next/font, Fraunces / Plus Jakarta Sans / IBM Plex Mono

## Setup
1. `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in your Supabase project URL + publishable key
3. Apply every migration in `supabase/migrations/` in filename order via the Supabase SQL Editor (or `supabase db push` once linked). Notes: 0003 and 0004 were folded into 0002 as inline blocks; 0006+ depend on functions created in earlier files, so order matters. `0013_security_hardening.sql` is idempotent (safe to re-run).
4. `npm run dev`

## CI
GitHub Actions runs `npm run typecheck` and `npm run build` on every push to
main and every pull request (`.github/workflows/ci.yml`).

## Design system: Kofar Mata (shared with ClashFree)
Locked palette, do not drift:
- bg `#110B27` · primary `#2A1F5E` · gold `#D7A33B` · secondary `#BD5B2C`
- success `#4F7A4B` · danger `#9C3B30`
- Fraunces (display/headline) · Plus Jakarta Sans (body/UI) · IBM Plex Mono (data)
