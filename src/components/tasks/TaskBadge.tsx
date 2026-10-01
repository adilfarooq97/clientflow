import type { TaskPriority, TaskStatus } from "@/types";

type TaskBadgeProps = {
  type: "status" | "priority";
  value: TaskStatus | TaskPriority;
};

const styles: Record<string, string> = {
  Todo: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Review: "bg-yellow-100 text-yellow-700",
  Done: "bg-green-100 text-green-700",

  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-red-100 text-red-700",
};

export default function TaskBadge({
  type,
  value,
}: TaskBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        styles[value]
      }`}
    >
      {type === "priority" ? `Priority: ${value}` : value}
    </span>
  );
}