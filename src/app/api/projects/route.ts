import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { isValidCalendarDate } from "@/lib/dates";

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
      { error: "Only freelancers can create projects" },
      { status: 403 }
    );
  }

  let body: {
    name?: unknown;
    description?: unknown;
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

  const { name, description, deadline } = body;

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

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name: name.trim(),
      description: description?.trim() ?? "",
      status: "Planning",
      progress: 0,
      deadline: deadline || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}