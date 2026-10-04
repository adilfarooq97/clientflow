import { NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/lib/supabase/projects";
import { getCurrentUserProfile } from "@/lib/supabase/auth";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const profile = await getCurrentUserProfile();

if (!profile || profile.role !== "freelancer") {
  return NextResponse.json(
    { error: "Only freelancers can update projects" },
    { status: 403 }
  );
}

    const project = await updateProject(id, {
      name: body.name,
      description: body.description,
      status: body.status,
      progress: body.progress,
      deadline: body.deadline || null,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update project.",
      },
      { status: 500 }
    );
  }
  
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    await deleteProject(id);
    const profile = await getCurrentUserProfile();

if (!profile || profile.role !== "freelancer") {
  return NextResponse.json(
    { error: "Only freelancers can delete projects" },
    { status: 403 }
  );
}

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete project.",
      },
      { status: 500 }
    );
  }
}