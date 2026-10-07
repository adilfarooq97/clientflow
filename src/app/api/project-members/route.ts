import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import {
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
  const projectId = searchParams.get("projectId")?.trim();

  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, owner_id")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError) {
    console.error("Error verifying project access:", projectError);

    return NextResponse.json(
      { error: "Unable to verify project access." },
      { status: 500 }
    );
  }

  if (!project) {
    return NextResponse.json(
      { error: "Project not found." },
      { status: 404 }
    );
  }

  if (project.owner_id !== user.id) {
    const { data: membership, error: membershipError } =
      await supabase
        .from("project_members")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipError) {
      console.error(
        "Error verifying project membership:",
        membershipError
      );

      return NextResponse.json(
        { error: "Unable to verify project access." },
        { status: 500 }
      );
    }

    if (!membership) {
      return NextResponse.json(
        { error: "You do not have access to this project." },
        { status: 403 }
      );
    }
  }

  const { data: members, error: membersError } = await supabase
    .from("project_members")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (membersError) {
    console.error("Error fetching project members:", membersError);

    return NextResponse.json(
      { error: "Unable to fetch project members." },
      { status: 500 }
    );
  }

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

  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "freelancer") {
    return NextResponse.json(
      { error: "Only freelancers can add project clients." },
      { status: 403 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { project_id, user_id, role } = body as Record<
    string,
    unknown
  >;

  if (
    typeof project_id !== "string" ||
    !project_id.trim() ||
    typeof user_id !== "string" ||
    !user_id.trim() ||
    typeof role !== "string"
  ) {
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

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", project_id.trim())
    .eq("owner_id", user.id)
    .maybeSingle();

  if (projectError) {
    console.error("Error verifying project ownership:", projectError);

    return NextResponse.json(
      { error: "Unable to verify project ownership." },
      { status: 500 }
    );
  }

  if (!project) {
    return NextResponse.json(
      { error: "You do not own this project." },
      { status: 403 }
    );
  }

  const { data: clientProfile, error: clientProfileError } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("id", user_id.trim())
      .eq("role", "client")
      .maybeSingle();

  if (clientProfileError) {
    console.error("Error verifying client profile:", clientProfileError);

    return NextResponse.json(
      { error: "Unable to verify selected client." },
      { status: 500 }
    );
  }

  if (!clientProfile) {
    return NextResponse.json(
      { error: "Selected user is not a client." },
      { status: 400 }
    );
  }

  try {
    const member = await addProjectMember({
      project_id: project_id.trim(),
      user_id: user_id.trim(),
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