import NotificationCenter from "@/components/notifications/NotificationCenter";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <div>
        <h1 className="text-sm font-medium text-gray-500">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationCenter />

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
            A
          </div>

          <span className="text-sm font-medium">
            Alex
          </span>
        </div>
      </div>
    </header>
  );
}