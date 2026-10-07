import type { ReactNode } from "react";

type AlertProps = {
  children: ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
  className?: string;
};

const toneClasses = {
  info: "border-info/20 bg-info-muted text-info",
  success: "border-success/20 bg-success-muted text-success",
  warning: "border-warning/20 bg-warning-muted text-warning",
  danger: "border-danger/20 bg-danger-muted text-danger",
};

export default function Alert({
  children,
  tone = "info",
  className = "",
}: AlertProps) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm leading-6 ${toneClasses[tone]} ${className}`}
      role={tone === "danger" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
