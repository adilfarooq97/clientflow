import StatCard from "@/components/dashboard/StatCard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import Button from "@/components/ui/Button";
import type { Project } from "@/types/project";
import ActivityItem from "@/components/dashboard/ActivityItem";

const stats = [
  {
    title: "Active Projects",
    value: "3",
  },
  {
    title: "Pending Reviews",
    value: "2",
  },
  {
    title: "Revenue",
    value: "$4,250",
  },
];

const projects: Project[] = [
  {
    id: 1,
    name: "Acme Website",
    description: "Website redesign for Acme Corporation",
    progress: 78,
    status: "In Progress",
    deadline: "Oct 12",
  },
  {
    id: 2,
    name: "Mobile App",
    description: "React Native application for startup",
    progress: 42,
    status: "In Progress",
    deadline: "Oct 20",
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

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Good morning 👋
      </h1>
      <p className="mt-1 text-gray-500">
        Here&apos;s what&apos;s happening with your projects.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Active Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Track the progress of your current projects.
            </p>
          </div>
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