"use client";

import dynamic from "next/dynamic";
import type { Task } from "@/types";

const KanbanBoard = dynamic(
  () => import("@/components/tasks/KanbanBoard"),
  {
    ssr: false,
  }
);

type KanbanBoardWrapperProps = {
  tasks: Task[];
  canManage?: boolean;
};

export default function KanbanBoardWrapper({
  tasks,
  canManage = true,
}: KanbanBoardWrapperProps) {
  return <KanbanBoard tasks={tasks} />;
}