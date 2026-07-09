import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditProfileForm from "./edit-profile-form";
import type { Profile } from "@/lib/types";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (!profile) redirect("/onboarding");

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <EditProfileForm profile={profile} />
    </div>
  );
}
