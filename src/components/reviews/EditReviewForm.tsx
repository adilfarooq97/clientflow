"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Review } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
  const [clientComment, setClientComment] = useState(
    review.client_comment
  );

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
          client_comment: clientComment.trim(),
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
          Update the review submission and client feedback.
        </p>
      </div>

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Review title
        </label>

        <Input
          id="title"
          label=""
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isLoading}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="fileUrl"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          File URL
        </label>

        <Input
          id="fileUrl"
          label=""
          type="url"
          value={fileUrl}
          onChange={(event) => setFileUrl(event.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="clientComment"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Client comment
        </label>

        <textarea
          id="clientComment"
          value={clientComment}
          onChange={(event) => setClientComment(event.target.value)}
          disabled={isLoading}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
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