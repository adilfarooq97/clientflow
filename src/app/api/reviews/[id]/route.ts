import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  deleteReview,
  updateReview,
} from "@/lib/supabase/reviews";
import { getCurrentUserProfile } from "@/lib/supabase/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
      { error: "Only freelancers can update reviews" },
      { status: 403 }
    );
  }

  const { data: review } = await supabase
    .from("reviews")
    .select("project_id, status")
    .eq("id", id)
    .maybeSingle();

  if (!review) {
    return NextResponse.json(
      { error: "Review not found." },
      { status: 404 }
    );
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", review.project_id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json(
      { error: "You do not have permission to update this review." },
      { status: 403 }
    );
  }

  let body: {
    title?: unknown;
    description?: unknown;
    file_url?: unknown;
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

  const {
    title,
    description,
    file_url,
    client_comment,
  } = body;

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return NextResponse.json(
      { error: "Description must be a string." },
      { status: 400 }
    );
  }

  if (
    typeof description === "string" &&
    description.trim().length > 5000
  ) {
    return NextResponse.json(
      { error: "Description must be 5000 characters or less." },
      { status: 400 }
    );
  }

  if (
    file_url !== undefined &&
    file_url !== null &&
    typeof file_url !== "string"
  ) {
    return NextResponse.json(
      { error: "File URL must be a string." },
      { status: 400 }
    );
  }
  if (
    client_comment !== undefined &&
    typeof client_comment !== "string"
  ) {
    return NextResponse.json(
      { error: "Client comment must be a string." },
      { status: 400 }
    );
  }

  if (
    typeof client_comment === "string" &&
    client_comment.trim().length > 1000
  ) {
    return NextResponse.json(
      { error: "Client comment must be 1000 characters or less." },
      { status: 400 }
    );
  }

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json(
      { error: "Title is required." },
      { status: 400 }
    );
  }

  if (title.trim().length > 200) {
    return NextResponse.json(
      { error: "Title must be 200 characters or less." },
      { status: 400 }
    );
  }


  try {
    const updatedReview = await updateReview(id, {
      title,
      description: description ?? "",
      file_url: file_url ?? null,
      status: review.status,
      client_comment: client_comment ?? "",
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);

    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
      { error: "Only freelancers can delete reviews" },
      { status: 403 }
    );
  }

  const { data: review } = await supabase
    .from("reviews")
    .select("project_id, status")
    .eq("id", id)
    .maybeSingle();

  if (!review) {
    return NextResponse.json(
      { error: "Review not found." },
      { status: 404 }
    );
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", review.project_id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json(
      { error: "You do not have permission to delete this review." },
      { status: 403 }
    );
  }

  try {
    await deleteReview(id);

    return NextResponse.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);

    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}