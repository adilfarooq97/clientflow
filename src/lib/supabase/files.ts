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

  const { data: file, error: fetchError } = await supabase
    .from("files")
    .select("file_url")
    .eq("id", fileId)
    .single();

  if (fetchError) {
    console.error("Error fetching file:", fetchError);
    throw new Error(fetchError.message);
  }

  const { error: storageError } = await supabase.storage
    .from("project-files")
    .remove([file.file_url]);

  if (storageError) {
    console.error(
      "Error deleting storage file:",
      storageError
    );

    throw new Error(storageError.message);
  }

  const { error: deleteError } = await supabase
    .from("files")
    .delete()
    .eq("id", fileId);

  if (deleteError) {
    console.error(
      "Error deleting file record:",
      deleteError
    );

    throw new Error(deleteError.message);
  }
}

export async function uploadProjectFile(
  projectId: string,
  file: File
) {
  const supabase = await createClient();

  const fileExtension =
    file.name.split(".").pop() || "bin";

  const filePath = `${projectId}/${crypto.randomUUID()}.${fileExtension}`;

  const { error } = await supabase.storage
    .from("project-files")
    .upload(filePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error);
    throw new Error(error.message);
  }

  return {
    path: filePath,
    name: file.name,
    type: file.type || "application/octet-stream",
  };
}

export async function getFileUrl(filePath: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("project-files")
    .createSignedUrl(filePath, 60 * 10);

  if (error) {
    console.error("Error creating signed URL:", error);
    throw new Error(error.message);
  }

  return data.signedUrl;
}