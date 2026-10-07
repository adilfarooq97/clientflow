"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

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
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger-muted text-danger">
          !
        </div>

        <h1 className="mt-4 text-xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          We couldn&apos;t load this part of ClientFlow. Please try again.
        </p>

        <Button
          onClick={() => reset()}
          className="mt-6"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}