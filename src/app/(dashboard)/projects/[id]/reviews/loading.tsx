export default function ReviewsLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-gray-100" />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div className="mt-8 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />

                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>

              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
            </div>

            <div className="mt-5 h-4 w-28 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}