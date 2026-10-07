import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { removeProjectMember } from "@/lib/supabase/project-members";

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
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

  const { id } = await params;

  const { data: member, error: memberError } = await supabase
    .from("project_members")
    .select("id, project_id")
    .eq("id", id)
    .maybeSingle();

  if (memberError) {
    console.error(
      "Error fetching project member:",
      memberError
    );

    return NextResponse.json(
      { error: "Failed to verify project member" },
      { status: 500 }
    );
  }

  if (!member) {
    return NextResponse.json(
      { error: "Project member not found" },
      { status: 404 }
    );
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", member.project_id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (projectError) {
    console.error(
      "Error verifying project ownership:",
      projectError
    );

    return NextResponse.json(
      { error: "Failed to verify project ownership" },
      { status: 500 }
    );
  }

  if (!project) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    await removeProjectMember(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Remove project member error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to remove project member" },
      { status: 500 }
    );
  }
}