"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type DeleteProjectButtonProps = {
  projectId: string;
};

export default function DeleteProjectButton({
  projectId,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/projects/${projectId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to delete project."
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? "Deleting..." : "Delete project"}
    </Button>
  );
}