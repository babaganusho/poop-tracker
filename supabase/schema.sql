-- Run this whole file once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run)

-- Profiles: one row per user, holds the public display name plus
-- self-reported profile stats (weight is optional, age/sitting time are not)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  age integer check (age > 0 and age < 150),
  weight_kg numeric check (weight_kg > 0 and weight_kg < 500),
  avg_sitting_minutes integer check (avg_sitting_minutes > 0 and avg_sitting_minutes <= 300),
  created_at timestamptz not null default now()
);

-- Entries: one poop-weight reading per user per day
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  weight_grams numeric not null check (weight_grams > 0 and weight_grams < 5000),
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

alter table public.profiles enable row level security;
alter table public.entries enable row level security;

-- Profiles: usernames are not sensitive, anyone signed in can see them (needed for compare UI)
create policy "profiles are readable by any signed-in user"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Entries: private. Only the owner can read/write their own daily readings.
create policy "users can read their own entries"
  on public.entries for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can insert their own entries"
  on public.entries for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own entries"
  on public.entries for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete their own entries"
  on public.entries for delete
  to authenticated
  using (auth.uid() = user_id);

-- Comparison leaderboard: exposes AGGREGATES only, never raw daily entries.
-- Owned by the table owner, so it can read across all users' entries while
-- each user's individual rows stay locked down by the policies above.
create view public.user_stats as
select
  p.username,
  count(e.id) as entries_count,
  round(avg(e.weight_grams)) as avg_weight_grams,
  max(e.weight_grams) as max_weight_grams,
  min(e.weight_grams) as min_weight_grams,
  max(e.entry_date) as last_entry_date
from public.profiles p
left join public.entries e on e.user_id = p.id
group by p.username;

grant select on public.user_stats to authenticated;
