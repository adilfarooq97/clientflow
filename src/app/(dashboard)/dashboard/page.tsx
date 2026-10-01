import StatCard from "@/components/dashboard/StatCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { getProjects } from "@/lib/supabase/projects";
import Link from "next/link";
import ActivityItem from "@/components/dashboard/ActivityItem";
import { getTasks } from "@/lib/supabase/tasks";

const stats = [
  {
    title: "Pending Reviews",
    value: "2",
  },
  {
    title: "Revenue",
    value: "$4,250",
  },
];

const activities = [
  {
    id: 1,
    title: "Homepage approved",
    description: "Acme Corporation approved the homepage design.",
    time: "10m ago",
  },
  {
    id: 2,
    title: "New feedback",
    description: "Sarah left feedback on the dashboard design.",
    time: "1h ago",
  },
  {
    id: 3,
    title: "Invoice paid",
    description: "Invoice #1042 was marked as paid.",
    time: "3h ago",
  },
];

export default async function Dashboard() {
  const projects = await getProjects();
  const taskGroups = await Promise.all(
    projects.map((project) => getTasks(project.id))
  );

  const tasks = taskGroups.flat();

  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const activeTasks = tasks.length - completedTasks;
  const activeProjects = projects.filter(
    (project) => project.status !== "Completed"
  );

  const dashboardStats = [
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
    ...stats,
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Good morning 👋
      </h1>
      <p className="mt-1 text-gray-500">
        Here&apos;s what&apos;s happening with your projects.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Active Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track the progress of your current projects.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + New Project
          </Link>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500">
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