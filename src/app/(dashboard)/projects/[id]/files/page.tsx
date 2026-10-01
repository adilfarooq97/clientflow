import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/supabase/projects";
import { getFiles } from "@/lib/supabase/files";
import FileCard from "@/components/files/FileCard";

export default async function FilesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const projects = await getProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  const files = await getFiles(project.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`/projects/${project.id}`}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to project
          </Link>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Files
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {project.name}
          </p>
        </div>

        <Link
          href={`/projects/${project.id}/files/new`}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          + Add File
        </Link>
      </div>

      {files.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">
            No files yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add your first project file.
          </p>

          <Link
            href={`/projects/${project.id}/files/new`}
            className="mt-4 inline-block text-sm font-medium text-gray-900 underline"
          >
            Add a file
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}