"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Task, TaskStatus } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";

type KanbanColumnProps = {
  column: TaskStatus;
  tasks: Task[];
  canManage?: boolean;
};

export default function KanbanColumn({
  column,
  tasks,
  canManage = true,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-64 rounded-xl border p-4 transition ${
        isOver
          ? "border-gray-400 bg-gray-100"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">
          {column}
        </h2>

        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-gray-500">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} canManage={canManage} />
        ))}

        {tasks.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            No tasks
          </p>
        )}
      </div>
    </div>
  );
}