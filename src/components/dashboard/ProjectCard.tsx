import Link from "next/link";
import type { Project } from "@/types/project";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const isCompleted = project.status === "Completed";

  const statusStyles = {
    Planning: "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Review: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
    >
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold tracking-tight text-gray-900">
              {project.name}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
              {project.description || "No project description available."}
            </p>
          </div>

          <span className="shrink-0 text-sm font-medium text-gray-600">
            {project.progress}%
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-gray-500">
              Progress
            </span>

            <span className="shrink-0 text-sm font-semibold text-gray-900">
              {project.progress}%
            </span>
          </div>

          <div className="mt-2">
            <Progress value={project.progress} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-sm">
          <span className="text-sm leading-6 text-gray-500">
            Due {project.deadline || "No deadline"}
          </span>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
                }`}
            >
              {isCompleted ? "Completed" : "Active"}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[project.status]
                }`}
            >
              {project.status}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}