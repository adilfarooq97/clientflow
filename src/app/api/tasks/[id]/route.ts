import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteTask, updateTask } from "@/lib/supabase/tasks";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import { isValidCalendarDate } from "@/lib/dates";


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (profile.role !== "freelancer") {
    return NextResponse.json(
      { error: "Only freelancers can update tasks." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    const { data: existingTask } = await supabase
      .from("tasks")
      .select("id, project_id")
      .eq("id", id)
      .maybeSingle();

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", existingTask.project_id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!project) {
      return NextResponse.json(
        { error: "You do not have permission to update this task." },
        { status: 403 }
      );
    }

    let body: {
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

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      status,
      priority,
      due_date,
    } = body;

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

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(
        status as (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid task status." },
        { status: 400 }
      );
    }

    if (
      typeof priority !== "string" ||
      !allowedPriorities.includes(
        priority as (typeof allowedPriorities)[number]
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

    if (
      typeof due_date === "string" &&
      due_date !== "" &&
      !isValidCalendarDate(due_date)
    ) {
      return NextResponse.json(
        { error: "Due date must be a valid calendar date." },
        { status: 400 }
      );
    }

    const task = await updateTask(id, {
      title: title.trim(),
      description:
        typeof description === "string"
          ? description.trim()
          : "",
      status: status as "Todo" | "In Progress" | "Review" | "Done",
      priority: priority as "Low" | "Medium" | "High",
      due_date:
        typeof due_date === "string" && due_date
          ? due_date
          : null,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update task.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

  const profile = await getCurrentUserProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (profile.role !== "freelancer") {
    return NextResponse.json(
      { error: "Only freelancers can delete tasks." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    const { data: existingTask } = await supabase
      .from("tasks")
      .select("id, project_id")
      .eq("id", id)
      .maybeSingle();

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", existingTask.project_id)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!project) {
      return NextResponse.json(
        { error: "You do not have permission to delete this task." },
        { status: 403 }
      );
    }

    await deleteTask(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting task:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete task.",
      },
      { status: 500 }
    );
  }
}