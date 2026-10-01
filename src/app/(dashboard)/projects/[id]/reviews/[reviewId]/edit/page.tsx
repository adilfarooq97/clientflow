import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/supabase/projects";
import { getReviews } from "@/lib/supabase/reviews";
import EditReviewForm from "@/components/reviews/EditReviewForm";
import DeleteReviewButton from "@/components/reviews/DeleteReviewButton";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{
    id: string;
    reviewId: string;
  }>;
}) {
  const { id, reviewId } = await params;

  const projects = await getProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const reviews = await getReviews(project.id);
  const review = reviews.find((item) => item.id === reviewId);

  if (!review) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/projects/${project.id}/reviews`}
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to reviews
      </Link>

      <EditReviewForm
  review={review}
  projectId={project.id}
/>

<div>
  <DeleteReviewButton
    reviewId={review.id}
    projectId={project.id}
  />
</div>
    </div>
  );
}