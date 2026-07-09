import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { computeStreak } from "@/lib/streak";
import { pick } from "@/lib/puns";
import EntryChart from "./entry-chart";
import RankBadge from "./rank-badge";
import type { Entry, Profile } from "@/lib/types";

function todayLocalISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

const NOTE_EMOJIS = ["💩", "🚽", "🧻", "😌"];
function emojiFor(index: number) {
  return NOTE_EMOJIS[index % NOTE_EMOJIS.length];
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false })
    .returns<Entry[]>();

  const entries = data ?? [];
  const today = todayLocalISO();
  const loggedToday = entries.some((e) => e.entry_date === today);
  const streak = computeStreak(entries.map((e) => e.entry_date));

  const weights = entries.map((e) => e.weight_grams);
  const avg = weights.length ? Math.round(weights.reduce((a, b) => a + b, 0) / weights.length) : null;
  const max = weights.length ? Math.max(...weights) : null;
  const min = weights.length ? Math.min(...weights) : null;

  return (
    <div>
      {/* Profile header */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-3xl">
          💩
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-stone-900">{profile?.username ?? "You"}</div>
          <div className="text-sm text-stone-500">{entries.length} {pick("entriesLoggedLabel")}</div>
        </div>
        <Link
          href="/log"
          className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium ${
            loggedToday
              ? "bg-green-100 text-green-800"
              : "bg-amber-800 text-white hover:bg-amber-900"
          }`}
        >
          {loggedToday ? pick("loggedTodayBtn") : pick("logTodayBtn")}
        </Link>
      </div>

      {/* Rank */}
      <div className="mb-4">
        <RankBadge entriesCount={entries.length} />
      </div>

      {/* About */}
      {profile && (profile.age || profile.weight_kg || profile.avg_sitting_minutes) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {profile.age && (
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm">
              🎂 {profile.age} yrs
            </span>
          )}
          {profile.weight_kg && (
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm">
              ⚖️ {profile.weight_kg} kg
            </span>
          )}
          {profile.avg_sitting_minutes && (
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-stone-600 shadow-sm">
              ⏱️ {profile.avg_sitting_minutes} min avg sitting
            </span>
          )}
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error.message}</p>}

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-6 text-center">
          <div className="mb-2 text-3xl">🚽</div>
          <p className="text-sm text-stone-600">{pick("noEntriesMsg")}</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <StatCard emoji="🔥" label={pick("streakLabel")} value={String(streak)} />
            <StatCard emoji="📊" label={pick("averageLabel")} value={`${avg} g`} />
            <StatCard emoji="⬆️" label={pick("heaviestLabel")} value={`${max} g`} />
            <StatCard emoji="⬇️" label={pick("lightestLabel")} value={`${min} g`} />
          </div>

          {/* Chart */}
          <div className="mb-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-stone-900">{pick("trendHeading")}</h2>
            <EntryChart entries={[...entries].reverse()} />
          </div>

          {/* Full log */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-stone-900">{pick("fullLogHeading")}</h2>
            <ul className="divide-y divide-stone-100">
              {entries.map((e, i) => (
                <li key={e.id}>
                  <Link
                    href={`/log?date=${e.entry_date}`}
                    className="flex items-center gap-3 py-2.5 active:bg-stone-50"
                  >
                    <span className="text-xl">{emojiFor(i)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-stone-900">{e.entry_date}</div>
                      {e.note && <div className="truncate text-xs text-stone-500">{e.note}</div>}
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      {e.weight_grams} g
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3 shadow-sm">
      <div className="text-lg">{emoji}</div>
      <div className="text-lg font-bold text-stone-900">{value}</div>
      <div className="text-xs text-stone-500">{label}</div>
    </div>
  );
}
