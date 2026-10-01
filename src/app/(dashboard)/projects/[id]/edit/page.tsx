import Link from "next/link";
import { notFound } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import EditProjectForm from "@/components/projects/EditProjectForm";
import { getProjects } from "@/lib/supabase/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const projects = await getProjects();

  const project = projects.find(
    (item) => item.id === id
  );

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to project
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Edit project
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update the details of your project.
        </p>
      </div>

      <AuthCard>
        <EditProjectForm project={project} />
      </AuthCard>
    </div>
  );
}