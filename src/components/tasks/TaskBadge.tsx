import type { TaskPriority, TaskStatus } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";

type TaskBadgeProps = {
  type: "status" | "priority";
  value: TaskStatus | TaskPriority;
};

export default function TaskBadge({
  type,
  value,
}: TaskBadgeProps) {
  return (
    <StatusBadge
      status={value}
      prefix={type === "priority" ? "Priority" : undefined}
    />
  );
}