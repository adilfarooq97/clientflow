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
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {project.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {project.description}
          </p>
        </div>

        <span className="text-sm font-medium text-gray-600">
          {project.progress}%
        </span>
      </div>

      <div className="mt-4">
        <Progress value={project.progress} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Due {project.deadline}
        </span>

        <Badge>
          {project.status}
        </Badge>
      </div>
    </Card>
  );
}