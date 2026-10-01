import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteTask, updateTask } from "@/lib/supabase/tasks";

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

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Task title is required." },
        { status: 400 }
      );
    }

    const task = await updateTask(id, {
      title: body.title.trim(),
      description: body.description?.trim() ?? "",
      status: body.status ?? "Todo",
      priority: body.priority ?? "Medium",
      due_date: body.due_date || null,
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

  try {
    const { id } = await params;

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