"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(Boolean(session));
      setChecking(false);
    });
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-gradient-to-b from-amber-50 to-stone-100 px-4 py-16">
      <div className="mb-6 text-center text-5xl">🔑</div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        {checking ? (
          <p className="text-sm text-stone-500">Checking your reset link...</p>
        ) : !hasSession ? (
          <>
            <h2 className="mb-1 font-medium text-stone-900">Link expired</h2>
            <p className="mb-4 text-sm text-stone-500">
              This reset link is invalid or has expired. Request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="block w-full rounded-xl bg-amber-800 px-4 py-3 text-center text-base font-semibold text-white hover:bg-amber-900"
            >
              Request new link
            </Link>
          </>
        ) : (
          <>
            <h2 className="mb-1 font-medium text-stone-900">Set a new password</h2>
            <p className="mb-4 text-sm text-stone-500">Choose a new password for your account.</p>

            <form onSubmit={onSubmit}>
              <label htmlFor="password" className="mb-1 block text-sm text-stone-500">
                New password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
              />

              <label htmlFor="confirmPassword" className="mb-1 block text-sm text-stone-500">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Type it again"
                className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-amber-800 px-4 py-3 text-base font-semibold text-white hover:bg-amber-900 disabled:opacity-50"
              >
                {loading ? "Saving..." : "💾 Save new password"}
              </button>
            </form>

            {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
