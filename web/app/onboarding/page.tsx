import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { pick } from "@/lib/puns";
import OnboardingForm from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) redirect("/");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-gradient-to-b from-amber-50 to-stone-100 px-4 py-16">
      <div className="mb-6 text-center text-5xl">🧻</div>
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 font-medium text-stone-900">{pick("usernameHeading")}</h2>
        <p className="mb-4 text-sm text-stone-500">{pick("usernameSubtitle")}</p>
        <OnboardingForm userId={user.id} />
      </div>
    </div>
  );
}
