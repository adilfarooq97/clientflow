"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ProjectNavigationProps = {
  projectId: string;
  active?: "overview" | "tasks" | "reviews" | "files" | "messages";
  counts?: {
    tasks?: number;
    reviews?: number;
    files?: number;
    messages?: number;
  };
};

const navigationItems = [
  { key: "overview", label: "Overview", suffix: "" },
  { key: "tasks", label: "Tasks", suffix: "/tasks", countKey: "tasks" },
  { key: "reviews", label: "Reviews", suffix: "/reviews", countKey: "reviews" },
  { key: "files", label: "Files", suffix: "/files", countKey: "files" },
  {
    key: "messages",
    label: "Messages",
    suffix: "/messages",
    countKey: "messages",
  },
] as const;

export default function ProjectNavigation({
  projectId,
  active,
  counts,
}: ProjectNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200">
      <div className="flex gap-6 overflow-x-auto">
        {navigationItems.map((item) => {
          const href = `/projects/${projectId}${item.suffix}`;
          const isActive =
            active === item.key ||
            (active === undefined && pathname === href);

          const count =
            "countKey" in item && counts
              ? counts[item.countKey as keyof typeof counts]
              : undefined;

          return (
            <Link
              key={item.key}
              href={href}
              className={`flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {item.label}

              {count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}