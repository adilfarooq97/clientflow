"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import TextareaField from "@/components/ui/TextareaField";
import Alert from "@/components/ui/Alert";

type CreateReviewFormProps = {
  projectId: string;
};

export default function CreateReviewForm({
  projectId,
}: CreateReviewFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Review title is required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          title: title.trim(),
          description: description.trim(),
          file_url: fileUrl.trim() || null,
          status: "Pending",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || "Failed to create review.");
        return;
      }

      router.push(`/projects/${projectId}/reviews`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-xl border border-gray-200 bg-white p-6"
    >
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Create Review
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Submit a design or deliverable for client review.
        </p>
      </div>

      <FormField
          id="title"
          label="Review title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Homepage design"
          disabled={isLoading}
        />

      <TextareaField
          id="description"
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe what you're sending for review..."
          disabled={isLoading}
          rows={4}
        />

      <FormField
          id="fileUrl"
          label="File URL"
          type="url"
          value={fileUrl}
          onChange={(event) => setFileUrl(event.target.value)}
          placeholder="https://..."
          disabled={isLoading}
        />

        <p className="mt-1 text-xs text-gray-500">
          For now, paste a link to the design or deliverable.
        </p>

      {error && (
        <Alert tone="danger">{error}</Alert>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Review"}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={isLoading}
          onClick={() =>
            router.push(`/projects/${projectId}/reviews`)
          }
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}