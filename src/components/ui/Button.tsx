type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const variantClasses = {
    primary:
      "bg-gray-900 text-white hover:bg-gray-800",

    secondary:
      "border bg-white text-gray-900 hover:bg-gray-50",

    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}