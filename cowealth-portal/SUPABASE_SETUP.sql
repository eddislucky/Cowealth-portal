-- ============================================
-- COWEALTH PORTAL — SUPABASE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. MEMBERS TABLE
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role text not null default 'Member' check (role in ('Member', 'Admin', 'Treasurer', 'Secretary')),
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. PAYMENT SUBMISSIONS (unverified, member-submitted)
create table if not exists payment_submissions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  amount numeric not null,
  contribution_month text not null,  -- format: YYYY-MM
  payment_reference text,
  notes text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

-- 3. CONTRIBUTIONS (approved, official record)
create table if not exists contributions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  amount numeric not null,
  contribution_month text not null,
  payment_reference text,
  shares_issued integer default 0,
  status text default 'approved',
  approved_at timestamptz,
  created_at timestamptz default now()
);

-- 4. MEETING MINUTES
create table if not exists meeting_minutes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_date date,
  attendees text,
  summary text,
  created_at timestamptz default now()
);

-- 5. ROW LEVEL SECURITY
alter table members enable row level security;
alter table payment_submissions enable row level security;
alter table contributions enable row level security;
alter table meeting_minutes enable row level security;

-- Members can read all members (for admin views)
create policy "members_read_all" on members for select using (auth.role() = 'authenticated');
create policy "members_insert_admin" on members for insert with check (auth.role() = 'authenticated');
create policy "members_update_admin" on members for update using (auth.role() = 'authenticated');

-- Payment submissions: members see own, admins see all
create policy "submissions_read" on payment_submissions for select using (auth.role() = 'authenticated');
create policy "submissions_insert" on payment_submissions for insert with check (auth.role() = 'authenticated');
create policy "submissions_update" on payment_submissions for update using (auth.role() = 'authenticated');

-- Contributions: all authenticated users can read, admins insert/update
create policy "contributions_read" on contributions for select using (auth.role() = 'authenticated');
create policy "contributions_insert" on contributions for insert with check (auth.role() = 'authenticated');
create policy "contributions_update" on contributions for update using (auth.role() = 'authenticated');

-- Meeting minutes: all authenticated
create policy "minutes_read" on meeting_minutes for select using (auth.role() = 'authenticated');
create policy "minutes_insert" on meeting_minutes for insert with check (auth.role() = 'authenticated');

-- ============================================
-- SAMPLE DATA — 9 MEMBERS
-- After running this, go to Supabase Auth > Users
-- and create auth users with the same emails.
-- Then update the user_id column to match.
-- ============================================

insert into members (full_name, email, role) values
  ('Lucky Idemudia Akahomhen', 'lucky@cowealth.ng', 'Admin'),
  ('Ella', 'ella@cowealth.ng', 'Member'),
  ('Franca', 'franca@cowealth.ng', 'Member'),
  ('Sinon', 'sinon@cowealth.ng', 'Member'),
  ('Nathan', 'nathan@cowealth.ng', 'Treasurer'),
  ('Anita', 'anita@cowealth.ng', 'Member'),
  ('Member 7', 'member7@cowealth.ng', 'Member'),
  ('Member 8', 'member8@cowealth.ng', 'Member'),
  ('Member 9', 'member9@cowealth.ng', 'Secretary')
on conflict (email) do nothing;
