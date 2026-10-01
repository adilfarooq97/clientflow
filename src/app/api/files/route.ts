import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createFile,
  getFiles,
} from "@/lib/supabase/files";
import type { FileType } from "@/types";

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
      { error: "projectId is required" },
      { status: 400 }
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

  const body = await request.json();

  const {
    project_id,
    name,
    file_url,
    file_type,
  } = body;

  if (!project_id || !name || !file_url) {
    return NextResponse.json(
      {
        error:
          "project_id, name, and file_url are required",
      },
      { status: 400 }
    );
  }

  try {
    const file = await createFile({
      project_id,
      name,
      file_url,
      file_type: (file_type ?? "other") as FileType,
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