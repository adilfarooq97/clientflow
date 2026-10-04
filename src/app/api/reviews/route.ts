import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createReview,
  getReviews,
} from "@/lib/supabase/reviews";
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

  const reviews = await getReviews(projectId);

  return NextResponse.json(reviews);
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
    { error: "Only freelancers can create reviews" },
    { status: 403 }
  );
}

  const body = await request.json();

  const {
    project_id,
    title,
    description,
    file_url,
    status,
    client_comment,
  } = body;

  if (!project_id) {
    return NextResponse.json(
      { error: "project_id is required." },
      { status: 400 }
    );
  }

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "Review title is required." },
      { status: 400 }
    );
  }

  try {
    const review = await createReview({
      project_id,
      title: title.trim(),
      description: description?.trim() ?? "",
      file_url: file_url || null,
      status: status ?? "Pending",
      client_comment: client_comment?.trim() ?? "",
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create review.",
      },
      { status: 500 }
    );
  }
}