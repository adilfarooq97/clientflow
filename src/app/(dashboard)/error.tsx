"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          !
        </div>

        <h1 className="mt-4 text-xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          We couldn't load this part of ClientFlow. Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}