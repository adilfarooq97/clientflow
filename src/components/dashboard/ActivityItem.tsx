import Link from "next/link";

type ActivityItemProps = {
  title: string;
  description: string;
  time: string;
  href?: string;
};

export default function ActivityItem({
  title,
  description,
  time,
  href,
}: ActivityItemProps) {
  const content = (
    <div className="flex items-start gap-4 py-4">
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gray-900" />

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <span className="shrink-0 text-xs text-gray-400">
        {time}
      </span>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="block rounded-lg transition hover:bg-gray-50"
    >
      {content}
    </Link>
  );
}