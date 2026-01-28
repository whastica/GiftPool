import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseProps = {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
};

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

const baseInputClasses =
  'w-full px-4 py-3 border-2 rounded-lg outline-none transition-all ' +
  'focus:ring-2 focus:ring-primary-100 focus:border-primary-600';

export const Input = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  id,
  ...props
}: InputProps) => {
  const inputId = id || props.name;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1 text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={!!error}
        className={`
          ${baseInputClasses}
          ${error ? 'border-red-500 focus:ring-red-100' : 'border-gray-200'}
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  id,
  rows = 4,
  ...props
}: TextareaProps) => {
  const textareaId = id || props.name;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block mb-1 text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={!!error}
        className={`
          ${baseInputClasses}
          resize-none
          ${error ? 'border-red-500 focus:ring-red-100' : 'border-gray-200'}
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};
