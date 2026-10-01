import type { FileType } from "@/types";

type FileTypeBadgeProps = {
  type: FileType;
};

const styles: Record<FileType, string> = {
  image: "bg-blue-100 text-blue-700",
  document: "bg-purple-100 text-purple-700",
  video: "bg-red-100 text-red-700",
  other: "bg-gray-100 text-gray-700",
};

export default function FileTypeBadge({
  type,
}: FileTypeBadgeProps) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${styles[type]}`}
    >
      {type}
    </span>
  );
}