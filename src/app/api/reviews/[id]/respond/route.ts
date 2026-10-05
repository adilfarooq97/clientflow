import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = ["Approved", "Changes Requested"] as const;

export async function PATCH(
  request: Request,
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
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, project_id, status")
    .eq("id", id)
    .single();

  if (reviewError || !review) {
    return NextResponse.json(
      { error: "Review not found." },
      { status: 404 }
    );
  }
  if (review.status !== "Pending") {
    return NextResponse.json(
      { error: "This review has already been responded to." },
      { status: 409 }
    );
  }

  const { data: membership, error: membershipError } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", review.project_id)
    .eq("user_id", user.id)
    .eq("role", "client")
    .maybeSingle();

  if (membershipError || !membership) {
    return NextResponse.json(
      { error: "You are not a client on this project." },
      { status: 403 }
    );
  }
  try {
    let body: {
      status?: unknown;
      client_comment?: unknown;
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

    const status = body.status;
    const clientComment =
      typeof body.client_comment === "string"
        ? body.client_comment.trim()
        : "";

    if (clientComment.length > 1000) {
      return NextResponse.json(
        { error: "Client comment must be 1000 characters or less." },
        { status: 400 }
      );
    }

    if (
      typeof status !== "string" ||
      !allowedStatuses.includes(
        status as (typeof allowedStatuses)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid review response." },
        { status: 400 }
      );
    }

    if (status === "Changes Requested" && !clientComment) {
      return NextResponse.json(
        { error: "Please provide a comment when requesting changes." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reviews")
      .update({
        status,
        client_comment: clientComment,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error responding to review:", error);

      return NextResponse.json(
        { error: "Unable to respond to review." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Review response error:", error);

    return NextResponse.json(
      { error: "Unable to respond to review." },
      { status: 500 }
    );
  }
}