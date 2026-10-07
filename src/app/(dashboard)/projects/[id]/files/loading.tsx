export default function FilesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-gray-100" />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="h-7 w-24 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-100" />

              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
            </div>

            <div className="mt-4 h-5 w-40 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-100" />

            <div className="mt-5 h-9 w-full animate-pulse rounded-lg bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}