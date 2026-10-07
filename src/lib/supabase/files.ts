import { createClient } from "@/lib/supabase/server";
import type { ProjectFile, FileType } from "@/types";
import { isExternalFileUrl } from "@/lib/files";

export async function getFiles(
  projectId: string | string[]
): Promise<ProjectFile[]> {
  const projectIds =
    typeof projectId === "string" ? [projectId] : projectId;

  if (projectIds.length === 0) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("files")
    .select("*")
    .in("project_id", projectIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching files:", error);
    throw new Error("Unable to load project files.");
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

  if (!isExternalFileUrl(file.file_url)) {
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
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Error verifying file access:", authError);
    throw new Error("Unable to verify file access.");
  }

  if (!user) {
    throw new Error("You must be logged in to access this file.");
  }

  const { data: file, error: fileError } = await supabase
    .from("files")
    .select("id, project_id")
    .eq("file_url", filePath)
    .maybeSingle();

  if (fileError) {
    console.error("Error fetching file:", fileError);
    throw new Error(fileError.message);
  }

  if (!file) {
    throw new Error("File not found");
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, owner_id")
    .eq("id", file.project_id)
    .maybeSingle();

  if (projectError) {
    console.error("Error verifying file access:", projectError);
    throw new Error("Unable to verify file access.");
  }

  if (!project) {
    throw new Error("Project not found.");
  }

  let hasAccess = project.owner_id === user.id;

  if (!hasAccess) {
    const { data: membership, error: membershipError } =
      await supabase
        .from("project_members")
        .select("id")
        .eq("project_id", project.id)
        .eq("user_id", user.id)
        .eq("role", "client")
        .maybeSingle();

    if (membershipError) {
      console.error("Error verifying file access:", membershipError);
      throw new Error("Unable to verify file access.");
    }

    hasAccess = Boolean(membership);
  }

  if (!hasAccess) {
    throw new Error("You do not have access to this file.");
  }

  const { data: signedUrl, error } = await supabase.storage
    .from("project-files")
    .createSignedUrl(filePath, 60 * 10);

  if (error) {
    console.error("Error creating signed URL:", error);
    throw new Error(error.message);
  }

  return signedUrl.signedUrl;
}