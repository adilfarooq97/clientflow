import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  MessageSquare,
} from "lucide-react";
import type { ReactNode } from "react";

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

const activityIcons: Record<ActivityType, ReactNode> = {
  review: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
  task: <ClipboardList className="h-4 w-4" aria-hidden="true" />,
  message: <MessageSquare className="h-4 w-4" aria-hidden="true" />,
  file: <FileText className="h-4 w-4" aria-hidden="true" />,
};

export default function ActivityItem({
  type,
  title,
  description,
  time,
  href,
}: ActivityItemProps) {
  const relativeTime = formatRelativeTime(time);

  const content = (
    <div className="flex items-start gap-4 rounded-lg py-4 transition-colors hover:bg-surface-muted">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
        {activityIcons[type]}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <span className="shrink-0 text-xs text-subtle-foreground">
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
      className="block rounded-lg transition hover:bg-surface-muted"
    >
      {content}
    </Link>
  );
}