"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteMessageButtonProps = {
  messageId: string;
  onDeleted: (messageId: string) => void;
};

export default function DeleteMessageButton({
  messageId,
  onDeleted,
}: DeleteMessageButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this message?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(
        `/api/messages/${messageId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || "Failed to delete message"
        );
      }

      onDeleted(messageId);
      router.refresh();
    } catch (error) {
      console.error("Delete message error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete message"
      );

      setIsDeleting(false);
    }
  };
  return (
    <>
      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="mt-1 text-xs text-gray-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </>
  );
}