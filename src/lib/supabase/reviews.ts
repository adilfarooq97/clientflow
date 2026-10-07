import { createClient } from "@/lib/supabase/server";
import type { Review, ReviewStatus } from "@/types";

export async function getReviews(
  projectId: string | string[]
): Promise<Review[]> {
  const projectIds =
    typeof projectId === "string" ? [projectId] : projectId;

  if (projectIds.length === 0) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .in("project_id", projectIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Unable to fetch project reviews.");
  }

  return data as Review[];
}

export async function createReview(review: {
  project_id: string;
  title: string;
  description: string;
  file_url: string | null;
  status: ReviewStatus;
  client_comment: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    throw new Error(error.message);
  }

  return data as Review;
}

export async function updateReview(
  reviewId: string,
  review: {
    title: string;
    description: string;
    file_url: string | null;
    status: ReviewStatus;
    client_comment: string;
  }
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .update({
      ...review,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .select()
    .single();

  if (error) {
    console.error("Error updating review:", error);
    throw new Error(error.message);
  }

  return data as Review;
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    console.error("Error deleting review:", error);
    throw new Error(error.message);
  }
}