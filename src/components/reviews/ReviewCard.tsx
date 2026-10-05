"use client";

import { useState } from "react";
import Link from "next/link";
import type { Review } from "@/types";
import ReviewBadge from "@/components/reviews/ReviewBadge";

type ReviewCardProps = {
  review: Review;
  projectId: string;
  canManage?: boolean;
};

export default function ReviewCard({
  review,
  projectId,
  canManage = true,
}: ReviewCardProps) {
  const [status, setStatus] = useState(review.status);
  const [clientComment, setClientComment] = useState(
    review.client_comment ?? ""
  );
  const [comment, setComment] = useState(
    review.client_comment ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const respondToReview = async (
    nextStatus: "Approved" | "Changes Requested"
  ) => {
    if (
      nextStatus === "Changes Requested" &&
      !comment.trim()
    ) {
      setError(
        "Please add a comment before requesting changes."
      );
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/reviews/${review.id}/respond`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
            client_comment: comment.trim(),
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to respond to review."
        );
      }

      setStatus(nextStatus);
      setClientComment(comment.trim());
      setComment("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to respond to review."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {review.title}
          </h3>

          {review.description && (
            <p className="mt-2 text-sm text-gray-600">
              {review.description}
            </p>
          )}
        </div>

        <ReviewBadge status={status} />
      </div>

      {clientComment && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-500">
            Client comment
          </p>

          <p className="mt-1 text-sm text-gray-700">
            {clientComment}
          </p>
        </div>
      )}

      {review.file_url && (
        <div className="mt-4">
          <a
            href={review.file_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-gray-900 underline"
          >
            View file
          </a>
        </div>
      )}

      {canManage && (
        <div className="mt-4">
          <Link
            href={`/projects/${projectId}/reviews/${review.id}/edit`}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Edit review →
          </Link>
        </div>
      )}

      {!canManage && status === "Pending" && (
        <div className="mt-5 border-t border-gray-200 pt-5">
          <label className="block text-sm font-medium text-gray-700">
            Feedback
          </label>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={4}
            placeholder="Add feedback for the freelancer..."
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            maxLength={1000}
            disabled={isSubmitting}
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => respondToReview("Approved")}
              disabled={isSubmitting}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Approve"}
            </button>

            <button
              type="button"
              onClick={() =>
                respondToReview("Changes Requested")
              }
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
            >
              Request Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}