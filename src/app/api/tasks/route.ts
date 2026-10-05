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

  const { data: membership } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: ownedProject } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!membership && !ownedProject) {
    return NextResponse.json(
      { error: "You do not have access to this project." },
      { status: 403 }
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

  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (profile.role !== "freelancer") {
    return NextResponse.json(
      { error: "Only freelancers can create tasks." },
      { status: 403 }
    );
  }

  let body: {
    project_id?: unknown;
    title?: unknown;
    description?: unknown;
    status?: unknown;
    priority?: unknown;
    due_date?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const {
    project_id,
    title,
    description,
    status,
    priority,
    due_date,
  } = body;

  if (typeof project_id !== "string" || !project_id) {
    return NextResponse.json(
      { error: "project_id is required." },
      { status: 400 }
    );
  }

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json(
      { error: "Task title is required." },
      { status: 400 }
    );
  }

  if (title.trim().length > 200) {
    return NextResponse.json(
      { error: "Task title must be 200 characters or fewer." },
      { status: 400 }
    );
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return NextResponse.json(
      { error: "Task description must be text." },
      { status: 400 }
    );
  }

  if (
    typeof description === "string" &&
    description.trim().length > 5000
  ) {
    return NextResponse.json(
      { error: "Task description must be 5000 characters or fewer." },
      { status: 400 }
    );
  }

  const allowedStatuses = [
    "Todo",
    "In Progress",
    "Review",
    "Done",
  ] as const;

  const allowedPriorities = [
    "Low",
    "Medium",
    "High",
  ] as const;

  const taskStatus =
    status === undefined ? "Todo" : status;

  const taskPriority =
    priority === undefined ? "Medium" : priority;

  if (
    typeof taskStatus !== "string" ||
    !allowedStatuses.includes(
      taskStatus as (typeof allowedStatuses)[number]
    )
  ) {
    return NextResponse.json(
      { error: "Invalid task status." },
      { status: 400 }
    );
  }

  if (
    typeof taskPriority !== "string" ||
    !allowedPriorities.includes(
      taskPriority as (typeof allowedPriorities)[number]
    )
  ) {
    return NextResponse.json(
      { error: "Invalid task priority." },
      { status: 400 }
    );
  }

  if (
    due_date !== undefined &&
    due_date !== null &&
    typeof due_date !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid due date." },
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
      { error: "You do not have permission to create tasks in this project." },
      { status: 403 }
    );
  }

  try {
    const task = await createTask({
      project_id,
      title: title.trim(),
      description:
        typeof description === "string"
          ? description.trim()
          : "",
      status: taskStatus as "Todo" | "In Progress" | "Review" | "Done",
      priority: taskPriority as "Low" | "Medium" | "High",
      due_date:
        typeof due_date === "string" && due_date
          ? due_date
          : null,
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