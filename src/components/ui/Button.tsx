type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  "aria-pressed"?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  "aria-pressed": ariaPressed,
}: ButtonProps) {
  const variantClasses = {
    primary:
      "border border-transparent bg-primary text-white hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-info",

    secondary:
      "border border-border bg-surface text-foreground hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-info",

    danger:
      "border border-transparent bg-danger text-white hover:brightness-90 focus-visible:ring-2 focus-visible:ring-danger",

    outline:
      "border border-border bg-transparent text-foreground hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-info",

    ghost:
      "border border-transparent bg-transparent text-muted-foreground hover:bg-surface-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-info",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={ariaPressed}
      className={`inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}