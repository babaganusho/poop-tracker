import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import BottomNav from "./bottom-nav";
import SignOutButton from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/onboarding");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gradient-to-b from-amber-50 to-stone-100">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200/70 bg-amber-50/90 px-4 py-3 backdrop-blur">
        <span className="text-base font-semibold text-stone-900">💩 Poop Tracker</span>
        <SignOutButton />
      </header>
      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
