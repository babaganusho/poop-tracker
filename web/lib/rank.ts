type Tier = {
  minRank: number;
  title: string;
  emoji: string;
  ring: string;
  glow: string;
};

// Ranks run 1-100, one rank per 5 logged entries. Tiers group ranks into
// named bands purely for flavor/display — the numeric rank is what's stored.
const TIERS: Tier[] = [
  { minRank: 1, title: "Newbie", emoji: "🌱", ring: "border-green-300", glow: "rgba(34,197,94,0.5)" },
  { minRank: 11, title: "Rookie Wiper", emoji: "🧻", ring: "border-sky-300", glow: "rgba(56,189,248,0.5)" },
  { minRank: 21, title: "Regular", emoji: "🚽", ring: "border-teal-300", glow: "rgba(45,212,191,0.5)" },
  { minRank: 31, title: "Seasoned Squatter", emoji: "💩", ring: "border-amber-400", glow: "rgba(217,119,6,0.5)" },
  { minRank: 41, title: "Fiber Fanatic", emoji: "🔥", ring: "border-orange-400", glow: "rgba(251,146,60,0.55)" },
  { minRank: 51, title: "Power Pooper", emoji: "⚡", ring: "border-red-400", glow: "rgba(248,113,113,0.55)" },
  { minRank: 61, title: "Bowel Boss", emoji: "🏆", ring: "border-rose-400", glow: "rgba(251,113,133,0.55)" },
  { minRank: 71, title: "Throne Royalty", emoji: "👑", ring: "border-purple-400", glow: "rgba(192,132,252,0.6)" },
  { minRank: 81, title: "Legendary Log", emoji: "🌟", ring: "border-indigo-400", glow: "rgba(129,140,248,0.6)" },
  { minRank: 91, title: "Poop Deity", emoji: "🐉", ring: "border-fuchsia-400", glow: "rgba(232,121,249,0.65)" },
  { minRank: 100, title: "Grand Master Shitter", emoji: "🏅", ring: "border-yellow-400", glow: "rgba(250,204,21,0.8)" },
];

export type RankInfo = {
  rank: number;
  title: string;
  emoji: string;
  ring: string;
  glow: string;
  isMax: boolean;
  entriesToNextRank: number;
};

const ENTRIES_PER_RANK = 5;
const MAX_RANK = 100;

export function getRank(entriesCount: number): RankInfo {
  const rank = Math.min(MAX_RANK, 1 + Math.floor(entriesCount / ENTRIES_PER_RANK));

  let tier = TIERS[0];
  for (const t of TIERS) {
    if (rank >= t.minRank) tier = t;
  }

  const isMax = rank >= MAX_RANK;
  const entriesToNextRank = isMax ? 0 : ENTRIES_PER_RANK * rank - entriesCount;

  return {
    rank,
    title: tier.title,
    emoji: tier.emoji,
    ring: tier.ring,
    glow: tier.glow,
    isMax,
    entriesToNextRank,
  };
}
