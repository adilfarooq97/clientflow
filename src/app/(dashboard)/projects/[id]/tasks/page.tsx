import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getTasks } from "@/lib/supabase/tasks";
import Button from "@/components/ui/Button";
import KanbanBoardWrapper from "@/components/tasks/KanbanBoardWrapper";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import ProjectNavigation from "@/components/projects/ProjectNavigation";


export default async function ProjectTasksPage({
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

  const tasks = await getTasks(project.id);
  const taskCounts = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "Todo").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    done: tasks.filter((task) => task.status === "Done").length,
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to project
        </Link>

        <ProjectNavigation projectId={project.id} />

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.name} Tasks
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {profile?.role === "freelancer"
                ? "Manage tasks and track project progress."
                : "View tasks and track project progress."}
            </p>
          </div>

          {profile?.role === "freelancer" && (
            <Link href={`/projects/${project.id}/tasks/new`}>
              <Button>New Task</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Total Tasks
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {taskCounts.total}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            To Do
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {taskCounts.todo}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            In Progress
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {taskCounts.inProgress}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">
            Completed
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {taskCounts.done}
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
          <h2 className="text-base font-semibold text-gray-900">
            No tasks yet
          </h2>

          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
            {profile?.role === "freelancer"
              ? "Create your first task to start organizing the work for this project."
              : "Tasks will appear here when work is added to this project."}
          </p>

          {profile?.role === "freelancer" && (
            <div className="mt-5">
              <Link href={`/projects/${project.id}/tasks/new`}>
                <Button>New Task</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <KanbanBoardWrapper
          tasks={tasks}
          canManage={profile?.role === "freelancer"}
        />
      )}
    </div>
  );
}