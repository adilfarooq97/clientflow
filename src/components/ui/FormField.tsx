import Input from "@/components/ui/Input";

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: string;
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
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <Input
        id={id}
        label={label}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}