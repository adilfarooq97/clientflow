"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import type { Task } from "@/types";
import TaskBadge from "@/components/tasks/TaskBadge";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${isDragging ? "opacity-50" : ""
        }`}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Drag ${task.title}`}
          className="mt-1 cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing"
        >
          ⋮⋮
        </button>

        <div className="min-w-0 flex-1">
          <Link
            href={`/projects/${task.project_id}/tasks/${task.id}/edit`}
            className="block"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-gray-900">
                {task.title}
              </h3>

              <TaskBadge
                type="priority"
                value={task.priority}
              />
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
        </div>
      </div>
    </div>
  );
}