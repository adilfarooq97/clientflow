"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type DeleteFileButtonProps = {
  fileId: string;
};

export default function DeleteFileButton({
  fileId,
}: DeleteFileButtonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmed) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      router.refresh();
    } catch (error) {
      console.error("Delete file error:", error);
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
      {isLoading ? "Deleting..." : "Delete"}
    </Button>
  );
}