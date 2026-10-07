export default function ProjectLoading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-gray-100" />

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="h-7 w-64 animate-pulse rounded-md bg-gray-200" />

        <div className="mt-4 space-y-2">
          <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="mt-5 h-4 w-40 animate-pulse rounded bg-gray-100" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="mt-3 h-9 w-16 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-3 w-32 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-5 h-3 w-full animate-pulse rounded-full bg-gray-100" />
      </div>
    </div>
  );
}