export default function ProjectsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="h-7 w-28 animate-pulse rounded-md bg-gray-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded-md bg-gray-100" />
        </div>

        <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="h-5 w-40 animate-pulse rounded-md bg-gray-200" />

            <div className="mt-3 space-y-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-gray-100" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-100" />
            </div>

            <div className="mt-6 h-2 w-full animate-pulse rounded-full bg-gray-100" />

            <div className="mt-5 flex justify-between">
              <div className="h-4 w-24 animate-pulse rounded-md bg-gray-100" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}