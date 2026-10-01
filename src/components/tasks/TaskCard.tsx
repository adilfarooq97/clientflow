import type { Task } from "@/types";
import Link from "next/link";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Link
  href={`/projects/${task.project_id}/tasks/${task.id}/edit`}
  className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-gray-900">
          {task.title}
        </h3>

        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="mt-2 text-sm text-gray-500">
          {task.description}
        </p>
      )}

      <div className="mt-3 text-xs text-gray-400">
        {task.due_date
          ? `Due ${task.due_date}`
          : "No due date"}
      </div>
    </Link>
  );
}