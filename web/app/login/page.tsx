"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { usePunned } from "@/lib/use-punned";

export default function LoginPage() {
  const appTitle = usePunned("appTitle");
  const tagline = usePunned("tagline");
  const signInTab = usePunned("signInTab");
  const signUpTab = usePunned("signUpTab");
  const submitSignIn = usePunned("submitSignIn");
  const submitSignUp = usePunned("submitSignUp");
  const pleaseWait = usePunned("pleaseWait");
  const emailLabel = usePunned("emailLabel");
  const passwordLabel = usePunned("passwordLabel");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error: authError } =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (mode === "signup" && !data.session) {
      setError("Check your email to confirm your account before signing in.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-gradient-to-b from-amber-50 to-stone-100 px-4 py-16">
      <div className="mb-6 text-center">
        <div className="mb-2 text-5xl">💩</div>
        <h1 className="text-xl font-semibold text-stone-900">{appTitle}</h1>
        <p className="mt-1 text-sm text-stone-500">
          {tagline}
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex rounded-xl bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium ${
              mode === "signin" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
            }`}
          >
            {signInTab}
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-lg py-2 text-sm font-medium ${
              mode === "signup" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
            }`}
          >
            {signUpTab}
          </button>
        </div>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Supabase isn&apos;t configured. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code>, then restart
            the dev server.
          </p>
        )}

        <form onSubmit={onSubmit}>
          <label htmlFor="email" className="mb-1 block text-sm text-stone-500">
            {emailLabel}
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

          <label htmlFor="password" className="mb-1 block text-sm text-stone-500">
            {passwordLabel}
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

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full rounded-xl bg-amber-800 px-4 py-3 text-base font-semibold text-white hover:bg-amber-900 disabled:opacity-50"
          >
            {loading ? pleaseWait : mode === "signup" ? submitSignUp : submitSignIn}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      </div>
    </div>
  );
}
