import Link from "next/link";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { getAccessibleProjects } from "@/lib/supabase/projects";
import { getCurrentUserProfile } from "@/lib/supabase/auth";

export default async function ProjectsPage() {
  const projects = await getAccessibleProjects();
  const userProfile = await getCurrentUserProfile();

  const isFreelancer = userProfile?.role === "freelancer";

  return (
    <div className="p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Projects
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {isFreelancer
              ? "Manage your projects and keep client work moving."
              : "View the projects you are currently working on."}
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
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">
            No projects yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {isFreelancer
              ? "Create your first project to get started."
              : "You have not been added to any projects yet."}
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
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}