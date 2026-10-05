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
  ...inputProps
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>

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
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-20 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}