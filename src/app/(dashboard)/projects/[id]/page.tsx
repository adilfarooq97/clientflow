import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/supabase/projects";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";

export default async function ProjectPage({
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
    <div className="p-8">
      <Link
        href="/dashboard"
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to dashboard
      </Link>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.name}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {project.description || "No description provided."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {project.status}
            </span>

<Link
  href={`/projects/${project.id}/tasks`}
  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
>
  View Tasks
</Link>
            <Link
              href={`/projects/${project.id}/edit`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Edit
            </Link>
            <DeleteProjectButton projectId={project.id} />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">
              Progress
            </span>

            <span className="text-gray-500">
              {project.progress}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-900"
              style={{
                width: `${project.progress}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Deadline
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {project.deadline || "No deadline"}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Created
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {new Date(
                project.created_at
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}