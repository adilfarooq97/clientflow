export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div>
        <div className="h-7 w-48 animate-pulse rounded-md bg-gray-200" />
        <div className="mt-2 h-4 w-40 animate-pulse rounded-md bg-gray-100" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-gray-100" />
        <div className="mt-3 h-6 w-20 animate-pulse rounded-full bg-gray-100" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="mt-3 h-9 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />

        <div className="mt-5 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />

        <div className="mt-4 h-40 animate-pulse rounded-xl border border-gray-200 bg-white" />
      </div>
    </div>
  );
}