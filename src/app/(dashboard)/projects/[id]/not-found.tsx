import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-gray-500">
          404
        </p>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Project not found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          This project does not exist or you do not have access to it.
        </p>

        <Link
          href="/projects"
          className="mt-6 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Back to Projects
        </Link>
      </div>
    </div>
  );
}