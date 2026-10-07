import type { InputHTMLAttributes } from "react";
import Input from "@/components/ui/Input";

type FormFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "value" | "onChange" | "type"
> & {
  id: string;
  label: string;
  type?: string;
  value?: string;
  error?: string;
  helperText?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  error,
  disabled = false,
  helperText,
  onChange,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Input
        {...inputProps}
        id={id}
        label={label}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [
            helperText ? `${id}-help` : null,
            error ? `${id}-error` : null,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
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