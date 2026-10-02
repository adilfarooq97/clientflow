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

  const handleRemove = async () => {
    const confirmed = window.confirm(
      "Remove this member from the project?"
    );

    if (!confirmed) {
      return;
    }

    setIsRemoving(true);

    try {
      const response = await fetch(
        `/api/project-members/${memberId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error || "Failed to remove member"
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Remove project member error:",
        error
      );

      setIsRemoving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleRemove()}
      disabled={isRemoving}
      className="text-xs font-medium text-gray-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isRemoving ? "Removing..." : "Remove"}
    </button>
  );
}