import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getMessages,
  createMessage,
} from "@/lib/supabase/messages";

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
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  const messages = await getMessages(projectId);

  return NextResponse.json(messages);
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
    content,
  } = body;

  if (!project_id || !content?.trim()) {
    return NextResponse.json(
      { error: "Project ID and message content are required" },
      { status: 400 }
    );
  }

  const message = await createMessage({
    project_id,
    sender_id: user.id,
    content: content.trim(),
  });

  return NextResponse.json(message, { status: 201 });
}