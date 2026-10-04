import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getTasks } from "@/lib/supabase/tasks";
import Button from "@/components/ui/Button";
import type { TaskStatus } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";
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
              Manage tasks and track project progress.
            </p>
          </div>

          {profile?.role === "freelancer" && (
  <Link href={`/projects/${project.id}/tasks/new`}>
    <Button>New Task</Button>
  </Link>
)}
        </div>
      </div>

      <KanbanBoardWrapper tasks={tasks} canManage={profile?.role === "freelancer"} />
    </div>
  );
}