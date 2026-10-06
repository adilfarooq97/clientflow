import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  MessageSquare,
} from "lucide-react";

type ActivityType = "review" | "task" | "message" | "file";

type ActivityItemProps = {
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  href?: string;
};

function formatRelativeTime(time: string) {
  const activityTime = new Date(time).getTime();
  const now = Date.now();
  const difference = Math.max(0, now - activityTime);

  const minutes = Math.floor(difference / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(time).toLocaleDateString();
}

function getActivityIcon(type: ActivityType) {
  if (type === "review") {
    return CheckCircle2;
  }

  if (type === "task") {
    return ClipboardList;
  }

  if (type === "message") {
    return MessageSquare;
  }

  return FileText;
}

export default function ActivityItem({
  type,
  title,
  description,
  time,
  href,
}: ActivityItemProps) {
  const Icon = getActivityIcon(type);
  const relativeTime = formatRelativeTime(time);


  const content = (
    <div className="flex items-start gap-4 py-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <span className="shrink-0 text-xs text-gray-400">
        {relativeTime}
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