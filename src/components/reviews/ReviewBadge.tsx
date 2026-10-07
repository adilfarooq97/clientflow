import type { ReviewStatus } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";

type ReviewBadgeProps = {
  status: ReviewStatus;
};

export default function ReviewBadge({
  status,
}: ReviewBadgeProps) {
  return <StatusBadge status={status} />;
}