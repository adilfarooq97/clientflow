import { createClient } from "@/lib/supabase/server";
import type { ProjectFile, FileType } from "@/types";

export async function getFiles(
  projectId: string
): Promise<ProjectFile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching files:", error);
    return [];
  }

  return data as ProjectFile[];
}

export async function createFile(file: {
  project_id: string;
  name: string;
  file_url: string;
  file_type: FileType;
  uploaded_by: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("files")
    .insert(file)
    .select()
    .single();

  if (error) {
    console.error("Error creating file:", error);
    throw new Error(error.message);
  }

  return data as ProjectFile;
}

export async function deleteFile(fileId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("files")
    .delete()
    .eq("id", fileId);

  if (error) {
    console.error("Error deleting file:", error);
    throw new Error(error.message);
  }
}