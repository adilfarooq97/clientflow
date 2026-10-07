export default function TasksLoading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-gray-100" />

      <div className="mt-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="min-h-96 rounded-xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />

            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, taskIndex) => (
                <div
                  key={taskIndex}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-gray-100" />

                  <div className="mt-4 h-5 w-16 animate-pulse rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}