import type { ProjectFile } from "@/types";
import DeleteFileButton from "@/components/files/DeleteFileButton";
import FileTypeBadge from "@/components/files/FileTypeBadge";

type FileCardProps = {
  file: ProjectFile;
  canManage?: boolean;
};

export default function FileCard({
  file,
  canManage = true,
}: FileCardProps) {
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

        <FileTypeBadge type={file.file_type} />
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
        {canManage && (
          <DeleteFileButton fileId={file.id} />
        )}
      </div>
    </div>
  );
}