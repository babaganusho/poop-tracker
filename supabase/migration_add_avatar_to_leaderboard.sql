-- Run this once in your Supabase project's SQL Editor to show avatars on
-- the leaderboard. Adds avatar_url to the existing user_stats view.
create or replace view public.user_stats as
select
  p.username,
  count(e.id) as entries_count,
  round(avg(e.weight_grams)) as avg_weight_grams,
  max(e.weight_grams) as max_weight_grams,
  min(e.weight_grams) as min_weight_grams,
  max(e.entry_date) as last_entry_date,
  p.avatar_url
from public.profiles p
left join public.entries e on e.user_id = p.id
group by p.username, p.avatar_url;

grant select on public.user_stats to authenticated;
