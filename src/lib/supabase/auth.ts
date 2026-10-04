import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUserProfile() {
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

  if (error) {
    console.error(
      "Error fetching current user profile:",
      error
    );

    return null;
  }

  return {
    id: data.id as string,
    full_name: data.full_name as string,
    role: data.role as UserRole,
  };
}