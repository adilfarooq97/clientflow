import StatCard from "@/components/dashboard/StatCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import Link from "next/link";
import ActivityItem from "@/components/dashboard/ActivityItem";
import { getTasks } from "@/lib/supabase/tasks";
import { getReviews } from "@/lib/supabase/reviews";
import { getFiles } from "@/lib/supabase/files";
import { getMessages } from "@/lib/supabase/messages";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getCurrentUserProfile } from "@/lib/supabase/auth";

export default async function Dashboard() {
  const projects = await getAccessibleProjects();
  const userProfile = await getCurrentUserProfile();
  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
        ? "Good afternoon"
        : "Good evening";
  const taskGroups = await Promise.all(
    projects.map((project) => getTasks(project.id))
  );

  const tasks = taskGroups.flat();
  const recentTaskActivities = tasks
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5)
    .map((task) => ({
      id: `task-${task.id}`,
      title: "Task created",
      description: task.title,
      time: new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(task.created_at)),
    }));

  const reviewGroups = await Promise.all(
    projects.map((project) => getReviews(project.id))
  );
  const messageGroups = await Promise.all(
    projects.map((project) => getMessages(project.id))
  );
  const messages = messageGroups.flat();

  const fileGroups = await Promise.all(
    projects.map((project) => getFiles(project.id))
  );

  const files = fileGroups.flat();

  const reviews = reviewGroups.flat();
  const recentActivities = reviews
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, 5)
    .map((review) => ({
      id: review.id,
      title:
        review.status === "Approved"
          ? "Review approved"
          : review.status === "Changes Requested"
            ? "Changes requested"
            : "Review pending",
      description: review.title,
      time: new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(review.updated_at)),
    }));

  const activities = [
    ...recentActivities,
    ...recentTaskActivities,
  ]
    .sort(
      (a, b) =>
        new Date(b.time).getTime() -
        new Date(a.time).getTime()
    )
    .slice(0, 5);

  const pendingReviews = reviews.filter(
    (review) => review.status === "Pending"
  );
  const approvedReviews = reviews.filter(
    (review) => review.status === "Approved"
  );

  const changesRequestedReviews = reviews.filter(
    (review) => review.status === "Changes Requested"
  );
  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const activeTasks = tasks.length - completedTasks;
  const activeProjects = projects.filter(
    (project) => project.status !== "Completed"
  );

  const dashboardStats =
    userProfile?.role === "freelancer"
      ? [
        {
          title: "Active Projects",
          value: activeProjects.length.toString(),
        },
        {
          title: "Active Tasks",
          value: activeTasks.toString(),
        },
        {
          title: "Completed Tasks",
          value: completedTasks.toString(),
        },
        {
          title: "Pending Reviews",
          value: pendingReviews.length.toString(),
        },
        {
          title: "Project Files",
          value: files.length.toString(),
        },
        {
          title: "Messages",
          value: messages.length.toString(),
        },
      ]
      : [
        {
          title: "My Projects",
          value: projects.length.toString(),
        },
        {
          title: "Open Tasks",
          value: activeTasks.toString(),
        },
        {
          title: "Reviews to Check",
          value: pendingReviews.length.toString(),
        },
        {
          title: "Project Files",
          value: files.length.toString(),
        },
        {
          title: "Messages",
          value: messages.length.toString(),
        },
      ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        {greeting} 👋
      </h1>
      {userProfile && (
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {userProfile.full_name}
        </p>
      )}
      <p className="mt-2 text-sm leading-6 text-gray-500">
        {userProfile?.role === "freelancer"
          ? "Manage your projects and keep client work moving."
          : "Track your projects, tasks, reviews, and conversations."}
      </p>
      {userProfile && (
        <span className="mt-2 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
          {userProfile.role}
        </span>
      )}
      <p className="mt-1 text-gray-500">
        Here&apos;s what&apos;s happening with your projects.
      </p>

      <div
        className={`mt-9 grid gap-4 sm:grid-cols-2 ${userProfile?.role === "freelancer"
          ? "lg:grid-cols-3 xl:grid-cols-6"
          : "lg:grid-cols-3 xl:grid-cols-5"
          }`}
      >
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 mt-9">
        <div className="flex items-center justify-between ">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-gray-900">
              Review Overview
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Current status of your project reviews.
            </p>
          </div>

          <Link
            href="/projects"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            View Projects →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700">
              Pending
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-900">
              {pendingReviews.length}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-green-700">
              Approved
            </p>

            <p className="mt-1 text-2xl font-bold text-green-900">
              {approvedReviews.length}
            </p>
          </div>

          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-700">
              Changes Requested
            </p>

            <p className="mt-1 text-2xl font-bold text-red-900">
              {changesRequestedReviews.length}
            </p>
          </div>
        </div>
      </div>
      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">
              Recent Projects
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              {userProfile?.role === "freelancer"
                ? "Keep track of your active client work."
                : "View the projects you are currently working on."}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View all →
            </Link>

            {userProfile?.role === "freelancer" && (
              <Link
                href="/projects/new"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                + New Project
              </Link>
            )}
          </div>
        </div>
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              No projects yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {userProfile?.role === "freelancer"
                ? "Create your first project to start managing your client work."
                : "You have not been added to any projects yet."}
            </p>

            {userProfile?.role === "freelancer" && (
              <Link
                href="/projects/new"
                className="mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Create Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Stay up to date with your latest activity.
          </p>
        </div>

        <div className="mt-4 divide-y rounded-xl border bg-white px-6">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              title={activity.title}
              description={activity.description}
              time={activity.time}
            />
          ))}
        </div>
      </section>
    </div>
  );
}