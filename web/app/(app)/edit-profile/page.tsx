import { redirect } from "next/navigation";
import { createClient, getAuthUser } from "@/lib/supabase/server";
import AvatarUpload from "./avatar-upload";
import EditProfileForm from "./edit-profile-form";
import type { Profile } from "@/lib/types";

export default async function EditProfilePage() {
  const {
    data: { user },
  } = await getAuthUser();
  if (!user) redirect("/login");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (!profile) redirect("/onboarding");

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <AvatarUpload userId={user.id} avatarUrl={profile.avatar_url} />
      <EditProfileForm profile={profile} />
    </div>
  );
}
