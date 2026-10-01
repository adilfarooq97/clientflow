import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/supabase/projects";
import { getTasks } from "@/lib/supabase/tasks";
import type { TaskStatus } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";
import KanbanBoardWrapper from "@/components/tasks/KanbanBoardWrapper";


export default async function ProjectTasksPage({
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

  const tasks = await getTasks(project.id);

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to project
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.name} Tasks
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage tasks and track project progress.
            </p>
          </div>

          <Link
            href={`/projects/${project.id}/tasks/new`}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + New Task
          </Link>
        </div>
      </div>

      <KanbanBoardWrapper tasks={tasks} />
    </div>
  );
}