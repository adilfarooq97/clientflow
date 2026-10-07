import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getProjectMembers,
  addProjectMember,
} from "@/lib/supabase/project-members";

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
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  const members = await getProjectMembers(projectId);

  return NextResponse.json(members);
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
    user_id,
    role,
  } = body;

  if (!project_id || !user_id || !role) {
    return NextResponse.json(
      {
        error:
          "Project ID, user ID, and role are required",
      },
      { status: 400 }
    );
  }

  if (role !== "client") {
    return NextResponse.json(
      { error: "Only client members can be added through this endpoint" },
      { status: 400 }
    );
  }

  try {
    const member = await addProjectMember({
      project_id,
      user_id,
      role,
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Add project member error:", error);

    if (
      error instanceof Error &&
      error.message.includes(
        "duplicate key value violates unique constraint"
      )
    ) {
      return NextResponse.json(
        { error: "This client is already a member of the project" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add project member" },
      { status: 500 }
    );
  }
}