"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { Message } from "@/types";

type MessageComposerProps = {
  projectId: string;
  onMessageSent: (message: Message) => void;
};

const MAX_LENGTH = 1000;

export default function MessageComposer({
  projectId,
  onMessageSent,
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

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const error =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Failed to send message";
        throw new Error(error);
      }

      if (
        !data ||
        typeof data !== "object" ||
        !("id" in data) ||
        typeof data.id !== "string" ||
        !("project_id" in data) ||
        typeof data.project_id !== "string" ||
        !("sender_id" in data) ||
        typeof data.sender_id !== "string" ||
        !("content" in data) ||
        typeof data.content !== "string" ||
        !("created_at" in data) ||
        typeof data.created_at !== "string"
      ) {
        throw new Error("The server returned an invalid message.");
      }

      onMessageSent({
        id: data.id,
        project_id: data.project_id,
        sender_id: data.sender_id,
        content: data.content,
        created_at: data.created_at,
      });
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
        aria-label="Write a message"
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
                ? "text-danger"
                : "text-subtle-foreground"
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
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}