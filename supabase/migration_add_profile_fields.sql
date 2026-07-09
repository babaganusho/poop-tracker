-- Run this once in your Supabase project's SQL Editor to add the new
-- profile fields (age, weight, average sitting time) to an existing database.
alter table public.profiles
  add column if not exists age integer check (age > 0 and age < 150),
  add column if not exists weight_kg numeric check (weight_kg > 0 and weight_kg < 500),
  add column if not exists avg_sitting_minutes integer check (avg_sitting_minutes > 0 and avg_sitting_minutes <= 300);
