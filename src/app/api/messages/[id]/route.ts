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

  const { data: message } = await supabase
    .from("messages")
    .select("id, sender_id")
    .eq("id", id)
    .maybeSingle();

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