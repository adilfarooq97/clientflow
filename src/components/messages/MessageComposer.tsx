"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type MessageComposerProps = {
  projectId: string;
};

const MAX_LENGTH = 1000;

export default function MessageComposer({
  projectId,
}: MessageComposerProps) {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent || isSending) {
      return;
    }

    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          content: trimmedContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to send message"
        );
      }

      setContent("");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={content}
        onChange={(event) => {
          if (event.target.value.length <= MAX_LENGTH) {
            setContent(event.target.value);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder="Write a message..."
        rows={3}
        disabled={isSending}
        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50"
      />

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400">
            Press Enter to send · Shift + Enter for a new line
          </p>

          <p
            className={`mt-1 text-xs ${
              content.length >= MAX_LENGTH
                ? "text-red-600"
                : "text-gray-400"
            }`}
          >
            {content.length}/{MAX_LENGTH}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isSending || !content.trim()}
        >
          {isSending ? "Sending..." : "Send message"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}