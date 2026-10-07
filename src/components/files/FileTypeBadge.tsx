import type { FileType } from "@/types";
import Badge from "@/components/ui/Badge";

type FileTypeBadgeProps = {
  type: FileType;
};

export default function FileTypeBadge({
  type,
}: FileTypeBadgeProps) {
  return (
    <Badge>
      {type}
    </Badge>
  );
}
