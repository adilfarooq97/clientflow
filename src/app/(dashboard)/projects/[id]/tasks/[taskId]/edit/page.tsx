import Link from "next/link";
import { notFound } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import EditTaskForm from "@/components/tasks/EditTaskForm";
import { getProjects } from "@/lib/supabase/projects";
import { getTasks } from "@/lib/supabase/tasks";
import DeleteTaskButton from "@/components/tasks/DeleteTaskButton";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>;
}) {
  const { id, taskId } = await params;

  const projects = await getProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const tasks = await getTasks(project.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
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
          Edit task
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update the details of this task.
        </p>
      </div>

      <AuthCard>
        <EditTaskForm task={task} />

        <div className="mt-6 border-t border-gray-200 pt-6">
          <DeleteTaskButton
            taskId={task.id}
            projectId={project.id}
          />
        </div>
      </AuthCard>
    </div>
  );
}