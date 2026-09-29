type ActivityItemProps = {
  title: string;
  description: string;
  time: string;
};

export default function ActivityItem({
  title,
  description,
  time,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="mt-1 h-2 w-2 rounded-full bg-gray-900" />

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <span className="text-xs text-gray-400">
        {time}
      </span>
    </div>
  );
}