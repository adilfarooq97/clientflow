import Link from "next/link";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import type { ProjectStatus } from "@/types";
import ProjectStatusFilter from "@/components/projects/ProjectStatusFilter";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";

export default async function ProjectsPage() {
  const projects = await getAccessibleProjects();
  const userProfile = await getCurrentUserProfile();

  const isFreelancer = userProfile?.role === "freelancer";
  const statusCounts: Record<ProjectStatus, number> = {
    Planning: projects.filter((project) => project.status === "Planning").length,
    "In Progress": projects.filter(
      (project) => project.status === "In Progress"
    ).length,
    Review: projects.filter((project) => project.status === "Review").length,
    Completed: projects.filter(
      (project) => project.status === "Completed"
    ).length,
  };
  const projectCountDescription = `${projects.length} ${
    projects.length === 1 ? "project" : "projects"
  } ${isFreelancer ? "in your workspace." : "available to you."}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description={projectCountDescription}
        action={isFreelancer ? (
          <Link href="/projects/new">
            <Button>New Project</Button>
          </Link>
        ) : undefined}
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description={
            isFreelancer
              ? "Create your first project to start organizing tasks, reviews, files, and client communication."
              : "You have not been added to any projects yet. Projects you have access to will appear here."
          }
          action={
            isFreelancer ? (
              <Link href="/projects/new">
                <Button>Create Project</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["Planning", "Planning"],
                ["In Progress", "In Progress"],
                ["Review", "Review"],
                ["Completed", "Completed"],
              ] as const
            ).map(([status, label]) => (
              <div
                key={status}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-gray-500">
                    {label}
                  </p>

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${status === "Planning"
                      ? "bg-subtle-foreground"
                      : status === "In Progress"
                        ? "bg-info"
                        : status === "Review"
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {statusCounts[status]}
                </p>
              </div>
            ))}
          </div>
          <ProjectStatusFilter projects={projects} />
        </>
      )}
    </div>
  );
}