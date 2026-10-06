import { createClient } from "@/lib/supabase/server";

export type ClientSummary = {
  id: string;
  full_name: string;
  project_count: number;
};
type ClientProfile = {
  id: string;
  full_name: string;
  role: "client" | "freelancer";
};

export async function getClients(): Promise<ClientSummary[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: projects, error: projectsError } =
    await supabase
      .from("projects")
      .select("id")
      .eq("owner_id", user.id);

  if (projectsError || !projects) {
    console.error(
      "Error fetching projects for clients:",
      projectsError
    );
    return [];
  }

  if (projects.length === 0) {
    return [];
  }

  const projectIds = projects.map(
    (project) => project.id
  );

  const { data: members, error: membersError } =
    await supabase
      .from("project_members")
      .select("user_id, project_id")
      .in("project_id", projectIds)
      .eq("role", "client");

  if (membersError || !members) {
    console.error(
      "Error fetching project clients:",
      membersError
    );
    return [];
  }

  if (members.length === 0) {
    return [];
  }

  const clientIds = [
    ...new Set(
      members.map((member) => member.user_id)
    ),
  ];

  const { data, error: profilesError } =
  await supabase.rpc(
    "get_project_member_profiles",
    {
      member_ids: clientIds,
    }
  );

const profiles = (data ?? []) as ClientProfile[];

  if (profilesError || !profiles) {
    console.error(
      "Error fetching client profiles:",
      profilesError
    );
    return [];
  }

  return profiles
    .map((profile) => ({
      id: profile.id,
      full_name: profile.full_name,
      project_count: members.filter(
        (member) => member.user_id === profile.id
      ).length,
    }))
    .sort((a, b) =>
      a.full_name.localeCompare(b.full_name)
    );
}