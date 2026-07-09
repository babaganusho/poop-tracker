import { getRank } from "@/lib/rank";

export default function RankBadge({ entriesCount }: { entriesCount: number }) {
  const { rank, title, emoji, ring, glow, isMax, entriesToNextRank } = getRank(entriesCount);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
        {isMax && (
          <div
            className="absolute inset-[-6px] rounded-full animate-rank-shine"
            style={{ background: `conic-gradient(from 0deg, transparent, ${glow}, transparent 60%)` }}
          />
        )}
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-full border-4 ${ring} animate-rank-pop animate-rank-glow bg-white text-2xl`}
          style={{ "--rank-glow-color": glow } as React.CSSProperties}
        >
          {emoji}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Rank {rank}/100
        </div>
        <div className="truncate text-base font-bold text-stone-900">{title}</div>
        {!isMax && (
          <div className="text-xs text-stone-500">
            {entriesToNextRank} more {entriesToNextRank === 1 ? "log" : "logs"} to rank up
          </div>
        )}
      </div>
    </div>
  );
}
