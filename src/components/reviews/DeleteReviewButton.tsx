"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type DeleteReviewButtonProps = {
  reviewId: string;
  projectId: string;
};

export default function DeleteReviewButton({
  reviewId,
  projectId,
}: DeleteReviewButtonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      router.push(`/projects/${projectId}/reviews`);
      router.refresh();
    } catch (error) {
      console.error("Delete review error:", error);
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
      {isLoading ? "Deleting..." : "Delete Review"}
    </Button>
  );
}