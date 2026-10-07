import { getClients } from "@/lib/supabase/client-data";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserProfile } from "@/lib/supabase/auth";

export default async function ClientsPage() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== "freelancer") {
    redirect("/dashboard");
  }

  const clients = await getClients();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Clients
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Clients connected to your projects.
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No clients yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add a client to one of your projects to see them here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                  {client.full_name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    {client.full_name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {client.project_count}{" "}
                    {client.project_count === 1
                      ? "project"
                      : "projects"}
                  </p>

                  {client.projects.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Projects
                      </p>

                      <div className="mt-2 space-y-1">
                        {client.projects.map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="block text-sm text-gray-600 transition hover:text-gray-900 hover:underline"
                          >
                            {project.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}