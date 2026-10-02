import { createClient } from "@/lib/supabase/server";

export type ClientProfile = {
  id: string;
  full_name: string;
  role: "client";
};

export type MemberProfile = {
  id: string;
  full_name: string;
  role: "client" | "freelancer";
};

export async function searchClients(
  search: string
): Promise<ClientProfile[]> {
  const supabase = await createClient();

  const trimmedSearch = search.trim();

  if (!trimmedSearch) {
    return [];
  }
  const { data, error } = await supabase.rpc(
    "search_client_profiles",
    {
      search_term: trimmedSearch,
    }
  );

  if (error) {
    console.error("Error searching clients:", error);
    return [];
  }

  return data as ClientProfile[];
}

export async function getMemberProfiles(
  userIds: string[]
): Promise<MemberProfile[]> {
  if (userIds.length === 0) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_project_member_profiles",
    {
      member_ids: userIds,
    }
  );

  if (error) {
    console.error(
      "Error fetching member profiles:",
      error
    );

    return [];
  }

  return data as MemberProfile[];
}