import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/supabase/projects";
import CreateReviewForm from "@/components/reviews/CreateReviewForm";

export default async function NewReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const projects = await getProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
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

      <CreateReviewForm projectId={project.id} />
    </div>
  );
}