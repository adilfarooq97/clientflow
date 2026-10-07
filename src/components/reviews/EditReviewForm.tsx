"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Review } from "@/types";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import TextareaField from "@/components/ui/TextareaField";
import Alert from "@/components/ui/Alert";

type EditReviewFormProps = {
  review: Review;
  projectId: string;
};

export default function EditReviewForm({
  review,
  projectId,
}: EditReviewFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(review.title);
  const [description, setDescription] = useState(review.description);
  const [fileUrl, setFileUrl] = useState(review.file_url ?? "");

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
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          file_url: fileUrl.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update review.");
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
          Edit Review
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the review submission.
        </p>
      </div>

      <FormField
          id="title"
          label="Review title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
        />

      <TextareaField
          id="description"
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isLoading}
          rows={4}
        />

      <FormField
          id="fileUrl"
          label="File URL"
          type="url"
          value={fileUrl}
          onChange={(event) => setFileUrl(event.target.value)}
          disabled={isLoading}
        />

      {error && (
        <Alert tone="danger">{error}</Alert>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
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