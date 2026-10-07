type ProgressProps = {
  value: number;
};

export default function Progress({
  value,
}: ProgressProps) {
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-surface-muted"
      role="progressbar"
      aria-valuenow={Math.max(0, Math.min(value, 100))}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  );
}