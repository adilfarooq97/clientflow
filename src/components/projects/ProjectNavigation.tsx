import Link from "next/link";

type ProjectNavigationProps = {
  projectId: string;
};

const navigation = [
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
  return (
    <nav className="mt-6 overflow-x-auto border-b border-gray-200">
      <div className="flex min-w-max gap-6">
        {navigation.map((item) => (
          <Link
            key={item.label}
            href={`/projects/${projectId}${item.href}`}
            className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-gray-500 transition hover:border-gray-900 hover:text-gray-900"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}