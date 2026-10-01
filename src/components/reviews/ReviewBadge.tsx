import type { ReviewStatus } from "@/types";

type ReviewBadgeProps = {
  status: ReviewStatus;
};

const styles: Record<ReviewStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  "Changes Requested": "bg-red-100 text-red-700",
};

export default function ReviewBadge({
  status,
}: ReviewBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}