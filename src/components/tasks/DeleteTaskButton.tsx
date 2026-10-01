"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type DeleteTaskButtonProps = {
  taskId: string;
  projectId: string;
};

export default function DeleteTaskButton({
  taskId,
  projectId,
}: DeleteTaskButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to delete task."
        );
      }

      router.push(`/projects/${projectId}/tasks`);
      router.refresh();
    } catch (error) {
      console.error("Delete task error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="danger"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? "Deleting..." : "Delete task"}
    </Button>
  );
}