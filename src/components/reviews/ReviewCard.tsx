import Link from "next/link";
import type { Review } from "@/types";

type ReviewCardProps = {
  review: Review;
  projectId: string;
};

const statusStyles: Record<Review["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  "Changes Requested": "bg-red-100 text-red-700",
};

export default function ReviewCard({
  review,
  projectId,
}: ReviewCardProps) {
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

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusStyles[review.status]}`}
        >
          {review.status}
        </span>
      </div>

      {review.client_comment && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-500">
            Client comment
          </p>

          <p className="mt-1 text-sm text-gray-700">
            {review.client_comment}
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

      <div className="mt-4">
        <Link
          href={`/projects/${projectId}/reviews/${review.id}/edit`}
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Edit review →
        </Link>
      </div>
    </div>
  );
}