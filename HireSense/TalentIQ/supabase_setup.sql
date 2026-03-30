-- TalentIQ — Supabase Database Setup
-- Run this ONCE in your Supabase project's SQL Editor
-- (supabase.com → your project → SQL Editor → New Query → paste → Run)

-- ① Create the screenings table
create table if not exists public.screenings (
  id              text        primary key,
  created_by      uuid        references auth.users(id) on delete set null,
  created_by_email text,
  jd_title        text,
  jd_reqs         jsonb,
  formula         jsonb,
  candidates      jsonb,
  created_at      timestamptz default now(),
  status          text        default 'completed'
);

-- ② Enable Row Level Security
alter table public.screenings enable row level security;

-- ③ Policy: any authenticated HR user can READ all screenings
--    (this is what makes cross-team visibility work)
create policy "HR team can view all screenings"
  on public.screenings
  for select
  to authenticated
  using (true);

-- ④ Policy: authenticated users can INSERT their own screenings
create policy "HR can create screenings"
  on public.screenings
  for insert
  to authenticated
  with check (auth.uid() = created_by);

-- ⑤ Policy: users can UPDATE only their own screenings
create policy "HR can update own screenings"
  on public.screenings
  for update
  to authenticated
  using (auth.uid() = created_by);

-- ⑥ Policy: users can DELETE only their own screenings
create policy "HR can delete own screenings"
  on public.screenings
  for delete
  to authenticated
  using (auth.uid() = created_by);

-- ⑦ Optional: index for fast queries by email
create index if not exists screenings_email_idx on public.screenings(created_by_email);
create index if not exists screenings_date_idx  on public.screenings(created_at desc);

-- Done! Now go back to TalentIQ and sign up / sign in.
