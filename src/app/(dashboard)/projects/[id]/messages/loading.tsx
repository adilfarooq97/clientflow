export default function MessagesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-gray-100" />

      <div className="mt-6">
        <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-40 animate-pulse rounded bg-gray-100" />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="min-h-96 space-y-6 p-6">
          <div className="flex justify-start">
            <div className="h-20 w-64 animate-pulse rounded-2xl bg-gray-100" />
          </div>

          <div className="flex justify-end">
            <div className="h-16 w-56 animate-pulse rounded-2xl bg-gray-200" />
          </div>

          <div className="flex justify-start">
            <div className="h-16 w-72 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  );
}