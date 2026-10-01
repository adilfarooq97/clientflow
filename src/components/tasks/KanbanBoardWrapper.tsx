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
};

export default function KanbanBoardWrapper({
  tasks,
}: KanbanBoardWrapperProps) {
  return <KanbanBoard tasks={tasks} />;
}