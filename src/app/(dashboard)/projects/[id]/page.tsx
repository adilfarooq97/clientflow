import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/supabase/projects";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import { getTasks } from "@/lib/supabase/tasks";

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

  const tasks = await getTasks(project.id);
  const completedTasks = tasks.filter(
  (task) => task.status === "Done"
).length;
const remainingTasks = tasks.length - completedTasks;

const taskProgress =
  tasks.length > 0
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;
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
      <div className="mt-8">
  <div className="mb-4 flex items-center justify-between">
    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Tasks
      </h2>

      <p className="text-sm text-gray-500">
        Track the work for this project.
      </p>
    </div>

    <Link
      href={`/projects/${project.id}/tasks`}
      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
    >
      View Tasks
    </Link>
  </div>

  <div className="grid gap-4 sm:grid-cols-3">
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">
        Total tasks
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {tasks.length}
      </p>
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">
        Completed
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {completedTasks}
      </p>
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">
        Remaining
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {remainingTasks}
      </p>
    </div>
  </div>
</div>
<div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-700">
        Task completion
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {completedTasks} of {tasks.length} tasks completed
      </p>
    </div>

    <span className="text-lg font-semibold text-gray-900">
      {taskProgress}%
    </span>
  </div>

  <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
    <div
      className="h-full rounded-full bg-gray-900 transition-all"
      style={{ width: `${taskProgress}%` }}
    />
  </div>
</div>
    </div>
    
  );
}