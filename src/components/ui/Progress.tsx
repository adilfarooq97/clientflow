type ProgressProps = {
  value: number;
};

export default function Progress({
  value,
}: ProgressProps) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-gray-900 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}