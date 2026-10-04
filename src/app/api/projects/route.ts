import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

if (!profile || profile.role !== "freelancer") {
  return NextResponse.json(
    { error: "Only freelancers can create projects" },
    { status: 403 }
  );
}

  const body = await request.json();

  const {
    name,
    description,
    status,
    progress,
    deadline,
  } = body;

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Project name is required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name: name.trim(),
      description: description?.trim() ?? "",
      status,
      progress: progress ?? 0,
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