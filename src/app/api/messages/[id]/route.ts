import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteMessage } from "@/lib/supabase/messages";

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

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .select("id, sender_id, project_id")
    .eq("id", id)
    .maybeSingle();

  if (messageError) {
    console.error("Error fetching message:", messageError);

    return NextResponse.json(
      { error: "Unable to verify message access." },
      { status: 500 }
    );
  }

  if (!message) {
    return NextResponse.json(
      { error: "Message not found." },
      { status: 404 }
    );
  }

  if (message.sender_id !== user.id) {
    return NextResponse.json(
      {
        error:
          "You can only delete your own messages.",
      },
      { status: 403 }
    );
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, owner_id")
    .eq("id", message.project_id)
    .maybeSingle();

  if (projectError) {
    console.error("Error verifying message access:", projectError);

    return NextResponse.json(
      { error: "Unable to verify message access." },
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
        .eq("project_id", message.project_id)
        .eq("user_id", user.id)
        .maybeSingle();

    if (membershipError) {
      console.error(
        "Error verifying message access:",
        membershipError
      );

      return NextResponse.json(
        { error: "Unable to verify message access." },
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

  try {
    await deleteMessage(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete message error:", error);

    return NextResponse.json(
      { error: "Failed to delete message." },
      { status: 500 }
    );
  }
}