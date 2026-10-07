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
  const [error, setError] = useState("");

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
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

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete project."
      );

      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p className="mb-2 rounded-lg border border-danger/20 bg-danger-muted px-3 py-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <Button
        variant="danger"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete project"}
      </Button>
    </div>
  );
}