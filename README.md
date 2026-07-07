# Daily Weigh-In Tracker

A single-file web app (`index.html`) for logging a daily weight measurement and
comparing your average against other users. No build step — open the file in
a browser once it's configured.

## Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to **SQL Editor**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the
   `profiles` and `entries` tables plus the `user_stats` comparison view, with
   row-level security so each user can only read/write their own daily entries.
3. In **Project Settings → API**, copy the **Project URL** and the **anon
   public key**.
4. Open `index.html` and near the top of the `<script>` block, fill in:
   ```js
   const SUPABASE_URL = "https://xxxx.supabase.co";
   const SUPABASE_ANON_KEY = "eyJ...";
   ```
5. Open `index.html` directly in a browser (double-click it, or serve it with
   any static file server).

## Using it

- Sign in with just an email address — Supabase sends a magic link, no
  password to manage.
- First sign-in asks for a display name; that's what shows up on the
  leaderboard.
- **Log Today**: enter today's weight in grams. Re-saving the same date
  updates that day's entry instead of creating a duplicate.
- **History**: your own trend line and full entry list.
- **Compare**: a leaderboard ranked by average weight. Only aggregates
  (average/min/max/entry count) are shared — nobody else can see your raw
  daily entries, by design of the RLS policies in `schema.sql`.

## Notes / next steps if you want to keep building

- Weight is stored in grams only; unit conversion for display would be a
  small client-side addition.
- Magic-link email sending on Supabase's free tier is rate-limited — fine for
  personal/small-group use, but worth knowing before inviting a big group.
- If this grows past a quick prototype, migrating to a proper framework
  (e.g. Next.js) would make auth/session handling and routing less manual —
  happy to do that once Node.js is available in this environment.
