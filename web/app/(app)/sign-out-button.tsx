"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePunned } from "@/lib/puns";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const signOutLabel = usePunned("signOut");
  const signingOutLabel = usePunned("signingOut");

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      disabled={loading}
      className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm text-amber-800 hover:bg-stone-50 disabled:opacity-50"
    >
      {loading ? signingOutLabel : signOutLabel}
    </button>
  );
}
