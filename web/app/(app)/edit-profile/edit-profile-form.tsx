"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const [username, setUsername] = useState(profile.username);
  const [age, setAge] = useState(profile.age != null ? String(profile.age) : "");
  const [weight, setWeight] = useState(profile.weight_kg != null ? String(profile.weight_kg) : "");
  const [avgSitting, setAvgSitting] = useState(
    profile.avg_sitting_minutes != null ? String(profile.avg_sitting_minutes) : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
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
    setStatus(null);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: trimmed,
        age: ageNum,
        weight_kg: weightNum,
        avg_sitting_minutes: sittingNum,
      })
      .eq("id", profile.id);
    setLoading(false);

    if (updateError) {
      setError(updateError.code === "23505" ? "That name is taken, try another." : updateError.message);
      return;
    }

    setStatus("Saved! 🎉");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-stone-900">✏️ Edit profile</h2>
        <Link href="/" className="text-sm text-amber-800">
          ← Profile
        </Link>
      </div>

      <label htmlFor="username" className="mb-1 block text-sm text-stone-500">
        Nickname
      </label>
      <input
        id="username"
        type="text"
        required
        maxLength={24}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
        className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-800 px-4 py-3 text-base font-semibold text-white hover:bg-amber-900 disabled:opacity-50"
      >
        {loading ? "Saving..." : "💾 Save changes"}
      </button>

      {status && <p className="mt-3 text-sm text-green-700">{status}</p>}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </form>
  );
}
