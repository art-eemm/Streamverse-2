import { type LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export function FormInput({
  label,
  icon: Icon,
  error,
  id,
  ...props
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-foreground font-sans"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          className={`w-full rounded-lg border bg-input px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors font-sans ${
            error ? "border-destructive" : "border-border"
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-destructive font-sans">{error}</p>
      )}
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export function FormTextarea({
  label,
  icon: Icon,
  error,
  id,
  ...props
}: FormTextareaProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-foreground font-sans"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <textarea
          id={id}
          className={`w-full rounded-lg border bg-input px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none font-sans ${
            error ? "border-destructive" : "border-border"
          }`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-destructive font-sans">{error}</p>
      )}
    </div>
  );
}
