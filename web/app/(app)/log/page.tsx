import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EntryForm from "./entry-form";
import type { Entry } from "@/lib/types";

function todayLocalISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { date: requestedDate } = await searchParams;
  const date = requestedDate ?? todayLocalISO();

  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("entry_date", date)
    .maybeSingle<Entry>();

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <EntryForm userId={user.id} initialDate={date} initialEntry={entry ?? null} />
    </div>
  );
}
