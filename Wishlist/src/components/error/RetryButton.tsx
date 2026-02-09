/**
 * RetryButton Component
 * Botón de reintento con estado de loading
 */

import { RefreshCw } from 'lucide-react'
import Button from '../ui/Button'

interface RetryButtonProps {
  onRetry: () => void
  isLoading?: boolean
  label?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const RetryButton = ({
  onRetry,
  isLoading = false,
  label = 'Reintentar',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: RetryButtonProps) => {
  return (
    <Button
      onClick={onRetry}
      disabled={isLoading}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
    >
      <RefreshCw
        className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
      />
      {isLoading ? 'Reintentando...' : label}
    </Button>
  )
}

export default RetryButton