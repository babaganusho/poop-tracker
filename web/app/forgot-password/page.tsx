"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "error"; msg: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);

    if (error) {
      setStatus({ type: "error", msg: error.message });
      return;
    }
    setStatus({ type: "ok", msg: "If that email has an account, a reset link is on its way." });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-gradient-to-b from-amber-50 to-stone-100 px-4 py-16">
      <div className="mb-6 text-center text-5xl">🔑</div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 font-medium text-stone-900">Reset your password</h2>
        <p className="mb-4 text-sm text-stone-500">
          Enter your email and we&apos;ll send you a link to set a new password.
        </p>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Supabase isn&apos;t configured.
          </p>
        )}

        <form onSubmit={onSubmit}>
          <label htmlFor="email" className="mb-1 block text-sm text-stone-500">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mb-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-900 outline-none focus:border-amber-700"
          />
          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full rounded-xl bg-amber-800 px-4 py-3 text-base font-semibold text-white hover:bg-amber-900 disabled:opacity-50"
          >
            {loading ? "Sending..." : "📧 Send reset link"}
          </button>
        </form>

        {status && (
          <p className={`mt-3 text-sm ${status.type === "error" ? "text-red-700" : "text-green-700"}`}>
            {status.msg}
          </p>
        )}

        <Link href="/login" className="mt-4 block text-center text-sm text-amber-800">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
