import type { TextareaHTMLAttributes } from "react";

type TextareaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
};

export default function TextareaField({
  id,
  label,
  error,
  helperText,
  className = "",
  ...textareaProps
}: TextareaFieldProps) {
  const describedBy = [
    helperText ? `${id}-help` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        {...textareaProps}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`min-h-24 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm leading-6 text-foreground outline-none transition placeholder:text-subtle-foreground hover:border-slate-300 focus-visible:border-info focus-visible:ring-2 focus-visible:ring-info/20 aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground disabled:opacity-70 ${className}`}
      />
      {helperText && (
        <p id={`${id}-help`} className="text-xs leading-5 text-muted-foreground">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
