import { createClient } from "@/lib/supabase/server";

export type ClientProject = {
  id: string;
  name: string;
};

export type ClientSummary = {
  id: string;
  full_name: string;
  project_count: number;
  projects: ClientProject[];
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
      .select("id, name")
      .eq("owner_id", user.id);

  if (projectsError || !projects) {
    console.error(
      "Error fetching projects for clients:",
      projectsError
    );
    throw new Error("Unable to load clients.");
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
    throw new Error("Unable to load clients.");
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
    throw new Error("Unable to load clients.");
  }

 return profiles
  .map((profile) => {
    const clientProjects = members
      .filter(
        (member) => member.user_id === profile.id
      )
      .map((member) => {
        const project = projects.find(
          (item) => item.id === member.project_id
        );

        return project
          ? {
              id: project.id,
              name: project.name,
            }
          : null;
      })
      .filter(
        (project): project is ClientProject =>
          project !== null
      );

    return {
      id: profile.id,
      full_name: profile.full_name,
      project_count: clientProjects.length,
      projects: clientProjects,
    };
  })
  .sort((a, b) =>
    a.full_name.localeCompare(b.full_name)
  );
}