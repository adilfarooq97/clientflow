import { createClient } from "@/lib/supabase/server";

export type ProfileSettings = {
  id: string;
  full_name: string;
  role: "freelancer" | "client";
};

export async function getProfileSettings(): Promise<ProfileSettings | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    console.error(
      "Error fetching profile settings:",
      error
    );

    return null;
  }

  return data as ProfileSettings;
}