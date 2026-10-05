import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getMessages,
  createMessage,
} from "@/lib/supabase/messages";

const MAX_MESSAGE_LENGTH = 1000;

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
      { error: "Project ID is required." },
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
      {
        error: "You do not have access to this project.",
      },
      { status: 403 }
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

  let body: {
    project_id?: unknown;
    content?: unknown;
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

  const { project_id, content } = body;

  if (
    typeof project_id !== "string" ||
    !project_id.trim()
  ) {
    return NextResponse.json(
      { error: "Project ID is required." },
      { status: 400 }
    );
  }

  if (
    typeof content !== "string" ||
    !content.trim()
  ) {
    return NextResponse.json(
      { error: "Message content is required." },
      { status: 400 }
    );
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        error: `Message must be ${MAX_MESSAGE_LENGTH} characters or less.`,
      },
      { status: 400 }
    );
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", project_id)
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
    .eq("project_id", project_id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: ownedProject } = await supabase
    .from("projects")
    .select("id")
    .eq("id", project_id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!membership && !ownedProject) {
    return NextResponse.json(
      {
        error:
          "You do not have access to this project.",
      },
      { status: 403 }
    );
  }

  try {
    const message = await createMessage({
      project_id: project_id.trim(),
      sender_id: user.id,
      content: trimmedContent,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);

    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}