"use client";

import { useState } from "react";

type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  disabled?: boolean;
};

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  id,
  disabled = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={
            type === "password" && showPassword
              ? "text"
              : type
          }
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
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