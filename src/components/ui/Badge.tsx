type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
};

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  const variantClasses = {
    default: "bg-surface-muted text-muted-foreground",
    success: "bg-success-muted text-success",
    warning: "bg-warning-muted text-warning",
    danger: "bg-danger-muted text-danger",
    info: "bg-info-muted text-info",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}