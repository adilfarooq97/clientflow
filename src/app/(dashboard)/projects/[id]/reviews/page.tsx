import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getReviews } from "@/lib/supabase/reviews";
import ReviewCard from "@/components/reviews/ReviewCard";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import Button from "@/components/ui/Button";
import ProjectNavigation from "@/components/projects/ProjectNavigation";
import EmptyState from "@/components/ui/EmptyState";


export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await getCurrentUserProfile();
  const projects = await getAccessibleProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const reviews = await getReviews(project.id);
  const pendingReviews = reviews.filter(
    (review) => review.status === "Pending"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`/projects/${project.id}`}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to project
          </Link>

          <ProjectNavigation projectId={project.id} />

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Design Reviews
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {project.name}
          </p>
        </div>

        {profile?.role === "freelancer" && (
          <Link href={`/projects/${project.id}/reviews/new`}>
            <Button>New Review</Button>
          </Link>
        )}
      </div>
      {profile?.role === "client" && pendingReviews.length > 0 && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-semibold text-yellow-900">
            {pendingReviews.length === 1
              ? "1 review is waiting for your approval."
              : `${pendingReviews.length} reviews are waiting for your approval.`}
          </p>

          <p className="mt-1 text-sm text-yellow-800">
            Review the submitted work and approve it or request changes.
          </p>
        </div>
      )}

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description={
            profile?.role === "freelancer"
              ? "Create your first review submission for this project."
              : "No review submissions have been added to this project yet."
          }
          action={
            profile?.role === "freelancer" ? (
              <Link href={`/projects/${project.id}/reviews/new`}>
                <Button>New Review</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              projectId={project.id}
              canManage={profile?.role === "freelancer"}
            />
          ))}
        </div>
      )}
    </div>
  );
}