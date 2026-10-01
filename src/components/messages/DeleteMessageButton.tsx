"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteMessageButtonProps = {
  messageId: string;
};

export default function DeleteMessageButton({
  messageId,
}: DeleteMessageButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this message?"
    );

    if (!confirmed) {
      return;
    }

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

      router.refresh();
    } catch (error) {
      console.error("Delete message error:", error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="mt-1 text-xs text-gray-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}