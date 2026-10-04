import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadProjectFile, createFile } from "@/lib/supabase/files";
import { getFileType } from "@/lib/files";
import { getCurrentUserProfile } from "@/lib/supabase/auth";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const profile = await getCurrentUserProfile();

if (!profile) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

if (profile.role !== "freelancer") {
  return NextResponse.json(
    { error: "Only freelancers can upload files" },
    { status: 403 }
  );
}

  const formData = await request.formData();

  const projectId = formData.get("project_id");
  const file = formData.get("file");

  if (
    typeof projectId !== "string" ||
    !(file instanceof File)
  ) {
    return NextResponse.json(
      { error: "project_id and file are required" },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: "File cannot be empty" },
      { status: 400 }
    );
  }

  const maxFileSize = 10 * 1024 * 1024;

  if (file.size > maxFileSize) {
    return NextResponse.json(
      { error: "File must be smaller than 10MB" },
      { status: 400 }
    );
  }

  try {
    const uploadedFile = await uploadProjectFile(
      projectId,
      file
    );

    const projectFile = await createFile({
      project_id: projectId,
      name: uploadedFile.name,
      file_url: uploadedFile.path,
      file_type: getFileType(file.type),
      uploaded_by: user.id,
    });

    return NextResponse.json(
      projectFile,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);

    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}