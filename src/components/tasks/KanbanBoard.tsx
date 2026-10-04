"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import type { Task, TaskStatus } from "@/types";
import TaskCard from "@/components/tasks/TaskCard";
import KanbanColumn from "@/components/tasks/KanbanColumn";
import TaskBadge from "@/components/tasks/TaskBadge";

type KanbanBoardProps = {
  tasks: Task[];
  canManage?: boolean;
};

const columns: TaskStatus[] = [
  "Todo",
  "In Progress",
  "Review",
  "Done",
];


export default function KanbanBoard({
  tasks: initialTasks,
   canManage = true,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(
  null
);
const activeTask = tasks.find(
  (task) => task.id === activeTaskId
);
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTaskId(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id) as TaskStatus;

    const task = tasks.find((item) => item.id === taskId);

    if (!task || !columns.includes(newStatus)) return;

    if (task.status === newStatus) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: newStatus,
          priority: task.priority,
          due_date: task.due_date,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          result?.error || "Unable to update task status."
        );
      }

      const updatedTask = await response.json();

setTasks((currentTasks) =>
  currentTasks.map((item) =>
    item.id === taskId ? updatedTask : item
  )
);
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  return (
    <DndContext
  collisionDetection={closestCorners}
  onDragStart={
    canManage
      ? ({ active }) => {
          setActiveTaskId(String(active.id));
        }
      : undefined
  }
  onDragCancel={() => {
    setActiveTaskId(null);
  }}
  onDragEnd={canManage ? handleDragEnd : undefined}
>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  {columns.map((column) => {
    const columnTasks = tasks.filter(
      (task) => task.status === column
    );

    return (
      <KanbanColumn
        key={column}
        column={column}
        tasks={columnTasks}
        canManage={canManage}
      />
    );
  })}
</div>
      <DragOverlay>
  {canManage && activeTask ? (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-gray-900">
          {activeTask.title}
        </h3>

        <TaskBadge
  type="priority"
  value={activeTask.priority}
/>
      </div>

      {activeTask.description && (
        <p className="mt-2 text-sm text-gray-500">
          {activeTask.description}
        </p>
      )}

      <div className="mt-3 text-xs text-gray-400">
        {activeTask.due_date
          ? `Due ${activeTask.due_date}`
          : "No due date"}
      </div>
    </div>
  ) : null}
</DragOverlay>
    </DndContext>
  );
}