import Link from "next/link";
import { notFound } from "next/navigation";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import { getTasks } from "@/lib/supabase/tasks";
import { getReviews } from "@/lib/supabase/reviews";
import { getFiles } from "@/lib/supabase/files";
import { getMessages } from "@/lib/supabase/messages";
import { getProjectMembers } from "@/lib/supabase/project-members";
import ProjectMembers from "@/components/projects/ProjectMembers";
import AddProjectClientForm from "@/components/projects/AddProjectClientForm";
import { getMemberProfiles } from "@/lib/supabase/users";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import ProjectNavigation from "@/components/projects/ProjectNavigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [projects, userProfile] = await Promise.all([
    getAccessibleProjects(),
    getCurrentUserProfile(),
  ]);


  const project = projects.find(
    (item) => item.id === id
  );

  if (!project) {
    notFound();
  }

  const [tasks, reviews, files, messages, members] =
    await Promise.all([
      getTasks(project.id),
      getReviews(project.id),
      getFiles(project.id),
      getMessages(project.id),
      getProjectMembers(project.id),
    ]);

  const memberProfiles =
    members.length > 0
      ? await getMemberProfiles(
        members.map((member) => member.user_id)
      )
      : [];

  let imageFiles = 0;
  let documentFiles = 0;

  for (const file of files) {
    if (file.file_type === "image") {
      imageFiles += 1;
    }

    if (file.file_type === "document") {
      documentFiles += 1;
    }
  }

  const pendingReviews = reviews.filter(
    (review) => review.status === "Pending"
  );
  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  ).length;
  const remainingTasks = tasks.length - completedTasks;

  const taskProgress =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;
  const deadlineDate = project.deadline
    ? new Date(`${project.deadline}T00:00:00`)
    : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntilDeadline = deadlineDate
    ? Math.round(
      (deadlineDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : null;
  return (
    <div className="p-8">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        ← Back to dashboard
      </Link>

      <ProjectNavigation projectId={project.id} />

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {project.name}
              </h1>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                {project.status}
              </span>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              {project.description || "No project description has been added yet."}
            </p>

            {project.deadline && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-500">
                  Deadline:
                </span>

                <span className="font-medium text-gray-900">
                  {project.deadline}
                </span>

                {daysUntilDeadline !== null && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${daysUntilDeadline < 0
                      ? "bg-red-100 text-red-700"
                      : daysUntilDeadline <= 3
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {daysUntilDeadline < 0
                      ? "Overdue"
                      : daysUntilDeadline === 0
                        ? "Due today"
                        : daysUntilDeadline === 1
                          ? "Due tomorrow"
                          : `${daysUntilDeadline} days left`}
                  </span>
                )}
              </div>
            )}
          </div>

          {userProfile?.role === "freelancer" && (
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/projects/${project.id}/edit`}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Edit Project
              </Link>

              <DeleteProjectButton projectId={project.id} />
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <ProjectMembers members={members} profiles={memberProfiles} canManage={userProfile?.role === "freelancer"} />

        {userProfile?.role === "freelancer" && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-5">
              <h2 className="font-semibold text-gray-900">
                Add Client
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Give an existing client access to this project.
              </p>
            </div>

            <AddProjectClientForm
              projectId={project.id}
            />
          </div>
        )}
      </div>
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
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
            {userProfile?.role === "freelancer"
              ? "Manage Tasks"
              : "View Tasks"}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
              Total Tasks
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {tasks.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Tasks across this project
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
              Completed Tasks
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {completedTasks}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {taskProgress}% of all tasks
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
              Remaining Tasks
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {remainingTasks}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Tasks still in progress
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
              Project Reviews
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {reviews.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {pendingReviews.length} pending review
              {pendingReviews.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-gray-900">
              Project Progress
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Progress based on completed tasks.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {completedTasks} of {tasks.length} tasks completed
            </p>
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            {taskProgress}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gray-900 transition-all"
            style={{ width: `${taskProgress}%` }}
          />
        </div>
      </div>
      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            Project Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access the latest areas of this project.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href={`/projects/${project.id}/reviews`}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              Reviews
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {reviews.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {pendingReviews.length} pending
            </p>
          </Link>

          <Link
            href={`/projects/${project.id}/files`}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              Files
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {files.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {imageFiles} images · {documentFiles} documents
            </p>
          </Link>

          <Link
            href={`/projects/${project.id}/messages`}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              Messages
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {messages.length}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Project conversation
            </p>
          </Link>
        </div>
      </div>
    </div>

  );
}