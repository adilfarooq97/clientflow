import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createTask, getTasks } from "@/lib/supabase/tasks";
import { getCurrentUserProfile } from "@/lib/supabase/auth";



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

  const profile = await getCurrentUserProfile();

if (!profile) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

if (profile.role !== "freelancer") {
  return NextResponse.json(
    { error: "Only freelancers can create tasks" },
    { status: 403 }
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

  const tasks = await getTasks(projectId);

  return NextResponse.json(tasks);
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
    title,
    description,
    status,
    priority,
    due_date,
  } = body;

  if (!project_id) {
    return NextResponse.json(
      { error: "project_id is required." },
      { status: 400 }
    );
  }

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "Task title is required." },
      { status: 400 }
    );
  }

  try {
    const task = await createTask({
      project_id,
      title: title.trim(),
      description: description?.trim() ?? "",
      status: status ?? "Todo",
      priority: priority ?? "Medium",
      due_date: due_date || null,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create task.",
      },
      { status: 500 }
    );
  }
}