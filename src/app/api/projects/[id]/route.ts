import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateProject, deleteProject } from "@/lib/supabase/projects";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import type { ProjectStatus } from "@/types";
import { isValidCalendarDate } from "@/lib/dates";

const allowedStatuses: ProjectStatus[] = [
  "Planning",
  "In Progress",
  "Review",
  "Completed",
];

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

    if (!profile || profile.role !== "freelancer") {
      return NextResponse.json(
        { error: "Only freelancers can update projects" },
        { status: 403 }
      );
    }

    const { data: existingProject } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found or access denied." },
        { status: 404 }
      );
    }

    let body: {
      name?: unknown;
      description?: unknown;
      status?: unknown;
      progress?: unknown;
      deadline?: unknown;
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

    const { name, description, status, progress, deadline } =
      body;

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        { error: "Project name is required." },
        { status: 400 }
      );
    }

    if (name.trim().length > 200) {
      return NextResponse.json(
        { error: "Project name must be 200 characters or fewer." },
        { status: 400 }
      );
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return NextResponse.json(
        { error: "Project description must be text." },
        { status: 400 }
      );
    }

    if (
      typeof description === "string" &&
      description.trim().length > 5000
    ) {
      return NextResponse.json(
        { error: "Description must be 5,000 characters or fewer." },
        { status: 400 }
      );
    }

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(status as ProjectStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid project status." },
        { status: 400 }
      );
    }

    if (
      typeof progress !== "number" ||
      !Number.isInteger(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      return NextResponse.json(
        { error: "Progress must be an integer between 0 and 100." },
        { status: 400 }
      );
    }

    if (
      deadline !== undefined &&
      deadline !== null &&
      typeof deadline !== "string"
    ) {
      return NextResponse.json(
        { error: "Project deadline is invalid." },
        { status: 400 }
      );
    }

    if (
      typeof deadline === "string" &&
      deadline !== "" &&
      !isValidCalendarDate(deadline)
    ) {
      return NextResponse.json(
        { error: "Project deadline must be a valid calendar date." },
        { status: 400 }
      );
    }

    const project = await updateProject(id, {
      name: name.trim(),
      description: description?.trim() ?? "",
      status: status as ProjectStatus,
      progress,
      deadline: deadline || null,
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

    if (!profile || profile.role !== "freelancer") {
      return NextResponse.json(
        { error: "Only freelancers can delete projects" },
        { status: 403 }
      );
    }

    const { data: existingProject } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found or access denied." },
        { status: 404 }
      );
    }

    await deleteProject(id);

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