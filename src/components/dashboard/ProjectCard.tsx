import Link from "next/link";
import type { Project } from "@/types/project";
import Card from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const isCompleted = project.status === "Completed";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2"
    >
      <Card className="h-full transition-shadow hover:shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold tracking-tight text-foreground">
              {project.name}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {project.description || "No project description available."}
            </p>
          </div>

          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            {project.progress}%
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-muted-foreground">
              Progress
            </span>

            <span className="shrink-0 text-sm font-semibold text-foreground">
              {project.progress}%
            </span>
          </div>

          <div className="mt-2">
            <Progress value={project.progress} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-sm">
          <span className="text-sm leading-6 text-muted-foreground">
            Due {project.deadline || "No deadline"}
          </span>

          <div className="flex items-center gap-2">
            <Badge variant={isCompleted ? "success" : "info"}>
              {isCompleted ? "Completed" : "Active"}
            </Badge>
            <StatusBadge
              status={project.status}
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}