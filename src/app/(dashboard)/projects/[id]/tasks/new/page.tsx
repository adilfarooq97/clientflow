import Link from "next/link";
import { notFound } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import CreateTaskForm from "@/components/tasks/CreateTaskForm";
import { getProjects } from "@/lib/supabase/projects";

export default async function NewTaskPage({
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
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/projects/${project.id}/tasks`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to tasks
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Create a new task
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add a task to {project.name}.
        </p>
      </div>

      <AuthCard>
        <CreateTaskForm projectId={project.id} />
      </AuthCard>
    </div>
  );
}