"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ProjectNavigationProps = {
  projectId: string;
};

type NavigationItem = {
  label: string;
  href: string;
};

const navigation: NavigationItem[] = [
  {
    label: "Overview",
    href: "",
  },
  {
    label: "Tasks",
    href: "/tasks",
  },
  {
    label: "Reviews",
    href: "/reviews",
  },
  {
    label: "Files",
    href: "/files",
  },
  {
    label: "Messages",
    href: "/messages",
  },
];

export default function ProjectNavigation({
  projectId,
}: ProjectNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-6 overflow-x-auto border-b border-gray-200">
      <div className="flex min-w-max gap-6">
        {navigation.map((item) => {
          const href = `/projects/${projectId}${item.href}`;

          const isActive =
            item.href === ""
              ? pathname === `/projects/${projectId}`
              : pathname.startsWith(href);

          return (
            <Link
              key={item.label}
              href={href}
              className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${isActive
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"
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