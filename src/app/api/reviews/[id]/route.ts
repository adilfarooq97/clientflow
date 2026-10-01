import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  deleteReview,
  updateReview,
} from "@/lib/supabase/reviews";
import type { ReviewStatus } from "@/types";

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

  const body = await request.json();

  const {
    title,
    description,
    file_url,
    status,
    client_comment,
  } = body;

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  try {
    const review = await updateReview(id, {
      title,
      description: description ?? "",
      file_url: file_url ?? null,
      status: status as ReviewStatus,
      client_comment: client_comment ?? "",
    });

    return NextResponse.json(review);
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