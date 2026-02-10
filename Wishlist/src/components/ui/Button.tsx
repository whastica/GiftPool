import type { ReactNode, MouseEventHandler } from 'react'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'

type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) => {
  const baseClasses =
    'font-semibold rounded-full transition-all duration-200 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:opacity-90 shadow-lg hover:shadow-xl focus:ring-primary-500 disabled:opacity-50',

    secondary:
      'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:opacity-50',

    outline:
      'bg-transparent text-gray-700 border-2 border-gray-300 hover:bg-gray-50 focus:ring-gray-400 disabled:opacity-50',

    ghost:
      'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-400 disabled:opacity-50',

    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50',

    // ✅ NUEVA VARIANTE SUCCESS
    success:
      'bg-green-500 text-black border border-green-500 hover:bg-green-400 hover:border-green-400 focus:ring-green-500 disabled:opacity-50',
  }

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const widthClass = fullWidth ? 'w-full' : ''
  const stateClass = disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'

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
        ${stateClass}
        ${className}
      `}
    >
      {loading ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
