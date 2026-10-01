import type { ProjectFile } from "@/types";
import DeleteFileButton from "@/components/files/DeleteFileButton";

type FileCardProps = {
  file: ProjectFile;
};

const fileTypeStyles: Record<ProjectFile["file_type"], string> = {
  image: "bg-blue-100 text-blue-700",
  document: "bg-purple-100 text-purple-700",
  video: "bg-red-100 text-red-700",
  other: "bg-gray-100 text-gray-700",
};

export default function FileCard({ file }: FileCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-gray-900">
            {file.name}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Added{" "}
            {new Date(file.created_at).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${fileTypeStyles[file.file_type]}`}
        >
          {file.file_type}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <a
          href={file.file_url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-gray-900 underline"
        >
          Open file
        </a>

        <DeleteFileButton fileId={file.id} />
      </div>
    </div>
  );
}