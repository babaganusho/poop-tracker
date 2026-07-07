function todayLocalISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

function addDaysISO(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Counts consecutive logged days ending today or yesterday. `datesDesc` must be sorted newest first. */
export function computeStreak(datesDesc: string[]): number {
  if (datesDesc.length === 0) return 0;

  const today = todayLocalISO();
  const yesterday = addDaysISO(today, -1);
  if (datesDesc[0] !== today && datesDesc[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < datesDesc.length; i++) {
    if (datesDesc[i] === addDaysISO(datesDesc[i - 1], -1)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
