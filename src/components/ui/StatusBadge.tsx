import type {
  InvoiceStatus,
  ProjectStatus,
  ReviewStatus,
  TaskPriority,
  TaskStatus,
} from "@/types";
import Badge from "@/components/ui/Badge";

type StatusValue =
  | InvoiceStatus
  | ProjectStatus
  | ReviewStatus
  | TaskPriority
  | TaskStatus;

type StatusBadgeProps = {
  status: StatusValue;
  prefix?: string;
};

const variants: Record<
  StatusValue,
  "default" | "success" | "warning" | "danger" | "info"
> = {
  Draft: "default",
  Planning: "default",
  Todo: "default",
  Low: "default",
  Pending: "warning",
  Review: "warning",
  Medium: "info",
  "In Progress": "info",
  Paid: "success",
  Approved: "success",
  Completed: "success",
  Done: "success",
  Overdue: "danger",
  High: "danger",
  "Changes Requested": "danger",
};

export default function StatusBadge({
  status,
  prefix,
}: StatusBadgeProps) {
  return (
    <Badge variant={variants[status]}>
      {prefix ? `${prefix}: ${status}` : status}
    </Badge>
  );
}
