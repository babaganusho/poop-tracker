import { useEffect, useState } from "react";

export const PUNS = {
  appTitle: [
    "Poop Tracker",
    "The Daily Dump Log",
    "Stool Stats Central",
    "Log Your Loot",
    "The Number Two Notebook",
    "Dump Truck Diaries",
  ],
  tagline: [
    "Log it daily. See your trend. See how you stack up.",
    "Drop your data. Watch your progress flow.",
    "Because what goes in must come out — and get logged.",
    "Every load counts. Track it here.",
    "Keep tabs on your tail-end totals.",
  ],
  signInTab: ["Sign in", "Take a seat", "Enter the throne room"],
  signUpTab: ["Sign up", "Join the club", "Pull up a seat"],
  submitSignIn: ["👋 Sign in", "🚽 Sign in", "👋 Take a seat"],
  submitSignUp: ["🚀 Create account", "🚀 Join the flush club", "🚀 Grab a stall"],
  pleaseWait: ["Please wait...", "Flushing through...", "Working on it..."],
  signOut: ["Sign out", "Flush & sign out", "Peace out", "Wipe & leave"],
  signingOut: ["Signing out...", "Flushing you out...", "Wiping down..."],
  profileLabel: ["Profile", "The Throne", "My Stats"],
  logLabel: ["Log", "Drop", "New Entry"],
  compareLabel: ["Compare", "Ranks", "Leaderboard"],
  entriesLoggedLabel: ["entries logged", "drops recorded", "deposits made", "logs on the books"],
  streakLabel: ["day streak", "days on a roll", "consecutive drops"],
  averageLabel: ["average", "average haul", "typical drop"],
  heaviestLabel: ["heaviest", "biggest drop", "personal record"],
  lightestLabel: ["lightest", "smallest drop", "featherweight"],
  trendHeading: ["📈 Your trend", "📈 The flow chart", "📈 Your arc"],
  fullLogHeading: ["🧾 Full log", "🧾 The complete record", "🧾 Every drop on file"],
  noEntriesMsg: [
    "No entries yet. Tap Log today to record your first one.",
    "Nothing logged yet. Tap Log today to break the seal.",
    "The log book is empty. Tap Log today to change that.",
  ],
  logTodayBtn: ["➕ Log today", "➕ Drop today's load", "➕ Today's deposit"],
  loggedTodayBtn: ["✅ Logged", "✅ Deposited", "✅ Done for today"],
  leaderboardHeading: ["🏆 Leaderboard", "🏆 The Stack Rankings", "🏆 Hall of Fame"],
  leaderboardSubtitle: [
    "Ranked by average daily weight. Only aggregates are shared — nobody sees your raw daily entries.",
    "Ranked by average output. Your raw data stays private — only the big numbers get shared.",
  ],
  noUsersMsg: ["No users yet.", "Nobody's logged in yet. Be the first."],
  youSuffix: [" (you)", " (that's you)", " (yup, you)"],
  newEntryHeading: ["💩 New entry", "💩 Fresh entry", "💩 Log it"],
  updateEntryHeading: ["✏️ Update entry", "✏️ Revise the log", "✏️ Amend the record"],
  dateLabel: ["📅 Date", "📅 The Big Day", "📅 D-Day"],
  weightLabel: ["⚖️ Weight (grams)", "⚖️ Payload (grams)", "⚖️ Deposit weight (grams)"],
  weightPlaceholder: ["e.g. 180", "e.g. 180 (go big)", "e.g. 180g of glory"],
  noteLabel: ["📝 Note (optional)", "📝 Commentary (optional)", "📝 Post-game notes (optional)"],
  notePlaceholder: ["Anything worth remembering...", "How'd it feel? Any regrets?", "Log the details, spare no fiber"],
  saveEntryBtn: ["💾 Save entry", "💾 Lock in the log", "💾 Seal the deal"],
  savingBtn: ["Saving...", "Flushing through...", "Locking it in..."],
  savedMsg: ["Saved! 🎉", "Logged and locked! 🎉", "Deposit confirmed! 🎉", "Flushed with success! 🎉"],
  usernameHeading: ["Pick a display name", "Pick your poop name", "Choose your throne handle"],
  usernameSubtitle: [
    "This is what other users will see on the comparison leaderboard.",
    "This is what other stackers will see on the leaderboard.",
    "Pick a name the other logs will recognize on the leaderboard.",
  ],
  usernamePlaceholder: ["e.g. FiberFiend", "e.g. LogLegend", "e.g. ThroneRuler", "e.g. DumpChampion", "e.g. PlopStar"],
  continueBtn: ["Continue →", "Lock it in →", "Commit to the bowl →"],
  emailLabel: ["Email", "📧 Email"],
  passwordLabel: ["Password", "🔒 Password"],
  displayNameLabel: ["Display name", "Throne handle", "Log alias"],
} satisfies Record<string, readonly string[]>;

export type PunKey = keyof typeof PUNS;

export function pick<K extends PunKey>(key: K): (typeof PUNS)[K][number] {
  const pool = PUNS[key];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Client-component hook: renders the first pool entry during SSR/initial
 * hydration (avoids a hydration mismatch), then swaps to a random pick
 * right after mount so the pun still randomizes on every page load.
 */
export function usePunned<K extends PunKey>(key: K): (typeof PUNS)[K][number] {
  const [value, setValue] = useState<(typeof PUNS)[K][number]>(PUNS[key][0]);
  useEffect(() => {
    setValue(pick(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}
