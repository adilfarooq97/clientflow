import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/supabase/projects";
import { getTasks } from "@/lib/supabase/tasks";
import type { TaskStatus } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";

const columns: TaskStatus[] = [
  "Todo",
  "In Progress",
  "Review",
  "Done",
];

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column
          );

          return (
            <div
              key={column}
              className="min-h-64 rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  {column}
                </h2>

                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-500">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}

                {columnTasks.length === 0 && (
                  <p className="py-6 text-center text-sm text-gray-400">
                    No tasks
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}