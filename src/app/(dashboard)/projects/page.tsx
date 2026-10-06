import Link from "next/link";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getCurrentUserProfile } from "@/lib/supabase/auth";
import type { ProjectStatus } from "@/types";

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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Projects
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isFreelancer
              ? `${projects.length} ${projects.length === 1 ? "project" : "projects"
              } in your workspace.`
              : `${projects.length} ${projects.length === 1 ? "project" : "projects"
              } available to you.`}
          </p>
        </div>

        {isFreelancer && (
          <Link
            href="/projects/new"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            + New Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <span className="text-lg font-semibold">P</span>
          </div>

          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            No projects yet
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isFreelancer
              ? "Create your first project to start organizing tasks, reviews, files, and client communication."
              : "You have not been added to any projects yet. Projects you have access to will appear here."}
          </p>

          {isFreelancer && (
            <Link
              href="/projects/new"
              className="mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Create Project
            </Link>
          )}
        </div>
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
                        ? "bg-gray-400"
                        : status === "In Progress"
                          ? "bg-blue-500"
                          : status === "Review"
                            ? "bg-yellow-500"
                            : "bg-green-500"
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
          <div className="mt-2 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}