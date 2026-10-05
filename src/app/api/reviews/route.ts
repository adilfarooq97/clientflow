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
      { error: "You do not have access to this project." },
      { status: 403 }
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

  let body: {
    project_id?: unknown;
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
    project_id,
    title,
    description,
    file_url,
    client_comment,
  } = body;

  const projectId =
    typeof project_id === "string" ? project_id.trim() : "";

  const reviewTitle =
    typeof title === "string" ? title.trim() : "";

  const reviewDescription =
    typeof description === "string" ? description.trim() : "";

  const reviewFileUrl =
    typeof file_url === "string" ? file_url.trim() : "";

  const reviewClientComment =
    typeof client_comment === "string"
      ? client_comment.trim()
      : "";

  if (!projectId) {
    return NextResponse.json(
      { error: "project_id is required." },
      { status: 400 }
    );
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json(
      {
        error:
          "You do not have permission to create a review for this project.",
      },
      { status: 403 }
    );
  }

  if (!reviewTitle) {
    return NextResponse.json(
      { error: "Review title is required." },
      { status: 400 }
    );
  }

  if (reviewTitle.length > 200) {
    return NextResponse.json(
      { error: "Review title must be 200 characters or less." },
      { status: 400 }
    );
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return NextResponse.json(
      { error: "Description must be a string." },
      { status: 400 }
    );
  }

  if (reviewDescription.length > 5000) {
    return NextResponse.json(
      { error: "Description must be 5000 characters or less." },
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

  if (reviewClientComment.length > 1000) {
    return NextResponse.json(
      { error: "Client comment must be 1000 characters or less." },
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

  if (reviewFileUrl) {
    try {
      new URL(reviewFileUrl);
    } catch {
      return NextResponse.json(
        { error: "File URL must be a valid URL." },
        { status: 400 }
      );
    }
  }

  try {
    const review = await createReview({
      project_id: projectId,
      title: reviewTitle,
      description: reviewDescription,
      file_url: reviewFileUrl || null,
      status: "Pending",
      client_comment: reviewClientComment,
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