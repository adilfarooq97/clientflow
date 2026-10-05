"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RemoveProjectMemberButtonProps = {
  memberId: string;
};

export default function RemoveProjectMemberButton({
  memberId,
}: RemoveProjectMemberButtonProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState("");

  const handleRemove = async () => {
    const confirmed = window.confirm(
      "Remove this member from the project?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsRemoving(true);

    try {
      const response = await fetch(
        `/api/project-members/${memberId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to remove member."
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Remove project member error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove member."
      );

      setIsRemoving(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void handleRemove()}
        disabled={isRemoving}
        className="text-xs font-medium text-gray-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRemoving ? "Removing..." : "Remove"}
      </button>

      {error && (
        <p className="max-w-40 text-right text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}