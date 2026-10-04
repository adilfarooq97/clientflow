import { createClient } from "@/lib/supabase/server";
import type {
  ProjectMember,
  ProjectMemberRole,
} from "@/types";

export async function getProjectMembers(
  projectId: string
): Promise<ProjectMember[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_members")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(
      "Error fetching project members:",
      error
    );

    return [];
  }

  return data as ProjectMember[];
}

export async function addProjectMember(member: {
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_members")
    .insert(member)
    .select()
    .single();

  if (error) {
    console.error(
      "Error adding project member:",
      error
    );

    throw new Error(error.message);
  }

  return data as ProjectMember;
}

export async function removeProjectMember(
  memberId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_members")
    .delete()
    .eq("id", memberId)
    .select("id")
    .single();

  if (error) {
    console.error(
      "Error removing project member:",
      error
    );

    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Project member was not removed.");
  }

  return data;
}