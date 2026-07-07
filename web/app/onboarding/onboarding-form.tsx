"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingForm({ userId }: { userId: string }) {
  const [username, setUsername] = useState("");
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

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({ id: userId, username: trimmed });
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
        Display name
      </label>
      <input
        id="username"
        type="text"
        required
        maxLength={24}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="e.g. FiberFiend"
        className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-amber-800 px-4 py-3 text-base font-semibold text-white hover:bg-amber-900 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Continue →"}
      </button>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </form>
  );
}
