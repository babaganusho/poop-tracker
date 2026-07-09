"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePunned } from "@/lib/use-punned";

export default function OnboardingForm({ userId }: { userId: string }) {
  const usernamePlaceholder = usePunned("usernamePlaceholder");
  const continueBtn = usePunned("continueBtn");
  const displayNameLabel = usePunned("displayNameLabel");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [avgSitting, setAvgSitting] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setError("Pick at least 2 characters.");
      return;
    }

    const ageNum = Number(age);
    if (!ageNum || ageNum <= 0 || ageNum >= 150) {
      setError("Enter a valid age.");
      return;
    }

    const sittingNum = Number(avgSitting);
    if (!sittingNum || sittingNum <= 0 || sittingNum > 300) {
      setError("Enter a valid average sitting time in minutes.");
      return;
    }

    const weightNum = weight.trim() ? Number(weight) : null;
    if (weightNum !== null && (weightNum <= 0 || weightNum >= 500)) {
      setError("Enter a valid weight, or leave it blank.");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("profiles").insert({
      id: userId,
      username: trimmed,
      age: ageNum,
      weight_kg: weightNum,
      avg_sitting_minutes: sittingNum,
    });
    setLoading(false);

    if (insertError) {
      setError(insertError.code === "23505" ? "That name is taken, try another." : insertError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="username" className="mb-1 block text-sm text-stone-500">
        {displayNameLabel}
      </label>
      <input
        id="username"
        type="text"
        required
        maxLength={24}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={usernamePlaceholder}
        className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
      />

      <label htmlFor="age" className="mb-1 block text-sm text-stone-500">
        Age
      </label>
      <input
        id="age"
        type="number"
        inputMode="numeric"
        required
        min={1}
        max={149}
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="e.g. 32"
        className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
      />

      <label htmlFor="weight" className="mb-1 block text-sm text-stone-500">
        Weight in kg (optional)
      </label>
      <input
        id="weight"
        type="number"
        inputMode="decimal"
        min={1}
        max={499}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="e.g. 75"
        className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
      />

      <label htmlFor="avgSitting" className="mb-1 block text-sm text-stone-500">
        Average sitting (minutes)
      </label>
      <input
        id="avgSitting"
        type="number"
        inputMode="numeric"
        required
        min={1}
        max={300}
        value={avgSitting}
        onChange={(e) => setAvgSitting(e.target.value)}
        placeholder="e.g. 10"
        className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-800 px-4 py-3 text-base font-semibold text-white hover:bg-amber-900 disabled:opacity-50"
      >
        {loading ? "Saving..." : continueBtn}
      </button>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </form>
  );
}
