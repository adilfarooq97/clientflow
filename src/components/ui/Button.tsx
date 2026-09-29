type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  children,
  variant = "primary",
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
      type="button"
      className={`rounded-lg px-4 py-2 text-sm font-medium ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}