import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data as Project[];
}

export async function createProject(project: {
  name: string;
  description: string;
  status: Project["status"];
  progress: number;
  deadline: string | null;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to create a project.");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      deadline: project.deadline,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    throw new Error(error.message);
  }

  return data as Project;
}

export async function updateProject(
  projectId: string,
  project: {
    name: string;
    description: string;
    status: Project["status"];
    progress: number;
    deadline: string | null;
  }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to update a project.");
  }

  const { data, error } = await supabase
    .from("projects")
    .update({
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      deadline: project.deadline,
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    throw new Error(error.message);
  }

  return data as Project;
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "You must be logged in to delete a project."
    );
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Error deleting project:", error);
    throw new Error(error.message);
  }
}