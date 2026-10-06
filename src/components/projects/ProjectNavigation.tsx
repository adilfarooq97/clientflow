"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ProjectNavigationProps = {
  projectId: string;
  active?: "overview" | "tasks" | "reviews" | "files" | "messages";
};

const navigationItems = [
  { key: "overview", label: "Overview", suffix: "" },
  { key: "tasks", label: "Tasks", suffix: "/tasks" },
  { key: "reviews", label: "Reviews", suffix: "/reviews" },
  { key: "files", label: "Files", suffix: "/files" },
  { key: "messages", label: "Messages", suffix: "/messages" },
] as const;

export default function ProjectNavigation({
  projectId,
  active,
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

          return (
            <Link
              key={item.key}
              href={href}
              className={`border-b-2 px-1 py-3 text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}