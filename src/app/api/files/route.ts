import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createFile,
  getFiles,
} from "@/lib/supabase/files";
import type { FileType } from "@/types";

const allowedFileTypes: FileType[] = [
  "image",
  "document",
  "other",
];

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "projectId is required." },
      { status: 400 }
    );
  }
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) {
    return NextResponse.json(
      { error: "Project not found." },
      { status: 404 }
    );
  }

  const isOwner = project.id
    ? await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("owner_id", user.id)
      .maybeSingle()
    : null;

  const { data: membership } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!isOwner?.data && !membership) {
    return NextResponse.json(
      { error: "You do not have access to this project." },
      { status: 403 }
    );
  }

  const files = await getFiles(projectId);

  return NextResponse.json(files);
}

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

  let body: {
    project_id?: unknown;
    name?: unknown;
    file_url?: unknown;
    file_type?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const {
    project_id,
    name,
    file_url,
    file_type,
  } = body;

  if (
    typeof project_id !== "string" ||
    !project_id.trim()
  ) {
    return NextResponse.json(
      { error: "project_id is required." },
      { status: 400 }
    );
  }

  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    return NextResponse.json(
      { error: "File name is required." },
      { status: 400 }
    );
  }

  if (name.trim().length > 255) {
    return NextResponse.json(
      { error: "File name must be 255 characters or less." },
      { status: 400 }
    );
  }

  if (
    typeof file_url !== "string" ||
    !file_url.trim()
  ) {
    return NextResponse.json(
      { error: "File URL is required." },
      { status: 400 }
    );
  }

  if (file_url.trim().length > 2000) {
    return NextResponse.json(
      { error: "File URL must be 2000 characters or less." },
      { status: 400 }
    );
  }

  try {
    new URL(file_url);
  } catch {
    return NextResponse.json(
      { error: "File URL must be a valid URL." },
      { status: 400 }
    );
  }

  const resolvedFileType =
    file_type ?? "other";

  if (
    typeof resolvedFileType !== "string" ||
    !allowedFileTypes.includes(
      resolvedFileType as FileType
    )
  ) {
    return NextResponse.json(
      { error: "Invalid file type." },
      { status: 400 }
    );
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", project_id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json(
      {
        error:
          "You do not have permission to upload files to this project.",
      },
      { status: 403 }
    );
  }

  try {
    const file = await createFile({
      project_id,
      name: name.trim(),
      file_url: file_url.trim(),
      file_type: resolvedFileType as FileType,
      uploaded_by: user.id,
    });

    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    console.error("Error creating file:", error);

    return NextResponse.json(
      { error: "Failed to create file" },
      { status: 500 }
    );
  }
}