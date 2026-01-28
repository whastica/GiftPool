import type { ReactNode, MouseEventHandler } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-full transition-all duration-200 inline-flex items-center justify-center'

  const variants: Record<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger', string> = {
    primary: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:opacity-90 shadow-lg hover:shadow-xl disabled:opacity-50',
    secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 disabled:opacity-50',
    outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-50',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
  }

  const sizes: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="spinner-small mr-2"></div>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button