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
    <nav aria-label="Project navigation" className="border-b border-border">
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
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-11 items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info ${
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-slate-300 hover:text-foreground"
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