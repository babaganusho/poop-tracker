import { redirect } from "next/navigation";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import { pick } from "@/lib/puns";
import type { UserStats } from "@/lib/types";

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function ComparePage() {
  const {
    data: { user },
  } = await getAuthUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .order("avg_weight_grams", { ascending: false, nullsFirst: false })
    .returns<UserStats[]>();

  const rows = data ?? [];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-stone-900">{pick("leaderboardHeading")}</h2>
        <p className="mt-1 text-sm text-stone-500">{pick("leaderboardSubtitle")}</p>
      </div>

      {error ? (
        <p className="text-sm text-red-700">{error.message}</p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-6 text-center">
          <div className="mb-2 text-3xl">🏆</div>
          <p className="text-sm text-stone-600">{pick("noUsersMsg")}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((u, i) => {
            const isMe = u.username === profile?.username;
            return (
              <li
                key={u.username}
                className={`flex items-center gap-3 rounded-2xl border p-3 shadow-sm ${
                  isMe ? "border-amber-300 bg-amber-50" : "border-stone-200 bg-white"
                }`}
              >
                <span className="w-7 shrink-0 text-center text-lg">
                  {MEDALS[i] ?? <span className="text-sm text-stone-400">#{i + 1}</span>}
                </span>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-100 text-lg">
                  {u.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    "💩"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-stone-900">
                    {u.username}
                    {isMe && pick("youSuffix")}
                  </div>
                  <div className="text-xs text-stone-500">
                    {u.entries_count} entries · last {u.last_entry_date ?? "—"}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">
                  {u.avg_weight_grams != null ? `${u.avg_weight_grams} g` : "—"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
