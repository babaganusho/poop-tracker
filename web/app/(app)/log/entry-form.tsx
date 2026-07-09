"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePunned } from "@/lib/puns";
import type { Entry } from "@/lib/types";

export default function EntryForm({
  userId,
  initialDate,
  initialEntry,
}: {
  userId: string;
  initialDate: string;
  initialEntry: Entry | null;
}) {
  const newEntryHeading = usePunned("newEntryHeading");
  const updateEntryHeading = usePunned("updateEntryHeading");
  const dateLabel = usePunned("dateLabel");
  const profileLabel = usePunned("profileLabel");
  const weightLabel = usePunned("weightLabel");
  const weightPlaceholder = usePunned("weightPlaceholder");
  const noteLabel = usePunned("noteLabel");
  const notePlaceholder = usePunned("notePlaceholder");
  const saveEntryBtn = usePunned("saveEntryBtn");
  const savingBtn = usePunned("savingBtn");
  const savedMsg = usePunned("savedMsg");
  const [date, setDate] = useState(initialDate);
  const [weight, setWeight] = useState(initialEntry ? String(initialEntry.weight_grams) : "");
  const [note, setNote] = useState(initialEntry?.note ?? "");
  const [existed, setExisted] = useState(Boolean(initialEntry));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const router = useRouter();

  async function loadForDate(newDate: string) {
    setDate(newDate);
    setStatus(null);
    const supabase = createClient();
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("user_id", userId)
      .eq("entry_date", newDate)
      .maybeSingle<Entry>();

    setWeight(data ? String(data.weight_grams) : "");
    setNote(data?.note ?? "");
    setExisted(Boolean(data));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const w = Number(weight);
    if (!w || w <= 0) {
      setStatus({ type: "error", msg: "Enter a weight in grams greater than 0." });
      return;
    }

    setLoading(true);
    setStatus(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("entries")
      .upsert(
        { user_id: userId, entry_date: date, weight_grams: w, note: note.trim() || null },
        { onConflict: "user_id,entry_date" }
      );
    setLoading(false);

    if (error) {
      setStatus({ type: "error", msg: error.message });
      return;
    }
    setExisted(true);
    setStatus({ type: "ok", msg: savedMsg });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-stone-900">
          {existed ? updateEntryHeading : newEntryHeading}
        </h2>
        <Link href="/" className="text-sm text-amber-800">
          ← {profileLabel}
        </Link>
      </div>

      <label htmlFor="date" className="mb-1 block text-sm text-stone-500">
        {dateLabel}
      </label>
      <input
        id="date"
        type="date"
        value={date}
        max={todayLocalISOClient()}
        onChange={(e) => loadForDate(e.target.value)}
        className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
      />

      <label htmlFor="weight" className="mb-1 block text-sm text-stone-500">
        {weightLabel}
      </label>
      <input
        id="weight"
        type="number"
        inputMode="numeric"
        min={1}
        max={4999}
        step={1}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder={weightPlaceholder}
        className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
      />

      <label htmlFor="note" className="mb-1 block text-sm text-stone-500">
        {noteLabel}
      </label>
      <textarea
        id="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={notePlaceholder}
        className="mb-4 min-h-[70px] w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-800 px-4 py-3 text-base font-semibold text-white hover:bg-amber-900 disabled:opacity-50"
      >
        {loading ? savingBtn : saveEntryBtn}
      </button>

      {status && (
        <p className={`mt-3 text-sm ${status.type === "error" ? "text-red-700" : "text-green-700"}`}>
          {status.msg}
        </p>
      )}
    </form>
  );
}

function todayLocalISOClient() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}
