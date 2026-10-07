"use client";

import { useState } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({
  label,
  type = "text",
  id,
  disabled = false,
  className = "",
  ...inputProps
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...inputProps}
          id={id}
          type={
            type === "password" && showPassword
              ? "text"
              : type
          }
          disabled={disabled}
          className={`min-h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm leading-6 text-foreground outline-none transition placeholder:text-subtle-foreground hover:border-slate-300 focus-visible:border-info focus-visible:ring-2 focus-visible:ring-info/20 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground disabled:opacity-70 ${type === "password" ? "pr-20" : ""} ${className}`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info disabled:pointer-events-none disabled:opacity-50"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}