
/**
 * ErrorState Component
 * Estado de error para secciones de la app con opción de reintentar
 */

import { AlertCircle, Wifi, WifiOff, Server } from 'lucide-react'
import Card from '../ui/Card'
import RetryButton from './RetryButton'
import type { ErrorInfo } from '../../services/errorHandler'

interface ErrorStateProps {
  error?: Error | string | ErrorInfo
  onRetry?: () => void
  isRetrying?: boolean
  title?: string
  description?: string
  showRetry?: boolean
  compact?: boolean
}

const ErrorState = ({
  error,
  onRetry,
  isRetrying = false,
  title,
  description,
  showRetry = true,
  compact = false,
}: ErrorStateProps) => {
  // Determinar tipo de error y mensaje
  let errorType: 'network' | 'server' | 'client' | 'unknown' = 'unknown'
  let errorMessage = 'Algo salió mal. Por favor intenta de nuevo.'
  
  if (error) {
    if (typeof error === 'string') {
      errorMessage = error
    } else if ('userMessage' in error && error.userMessage) {
      errorMessage = error.userMessage
      errorType = error.type
    } else if ('message' in error && error.message) {
      errorMessage = error.message
    }
  }

  // Seleccionar ícono según tipo de error
  const ErrorIcon = errorType === 'network' 
    ? WifiOff 
    : errorType === 'server' 
    ? Server 
    : AlertCircle

  // Seleccionar color según tipo de error
  const iconColor = errorType === 'network' 
    ? 'text-orange-600' 
    : errorType === 'server' 
    ? 'text-purple-600' 
    : 'text-red-600'

  const iconBgColor = errorType === 'network' 
    ? 'bg-orange-100' 
    : errorType === 'server' 
    ? 'bg-purple-100' 
    : 'bg-red-100'

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3 flex-1">
          <ErrorIcon className={`w-5 h-5 ${iconColor}`} />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {title || 'Error'}
            </p>
            <p className="text-xs text-gray-600">{errorMessage}</p>
          </div>
        </div>
        {showRetry && onRetry && (
          <RetryButton
            onRetry={onRetry}
            isLoading={isRetrying}
            size="sm"
            variant="outline"
          />
        )}
      </div>
    )
  }

  return (
    <Card className="text-center py-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${iconBgColor} mb-6`}>
          <ErrorIcon className={`w-8 h-8 ${iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {title || 'Algo salió mal'}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description || errorMessage}
        </p>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <div className="flex justify-center">
            <RetryButton
              onRetry={onRetry}
              isLoading={isRetrying}
              size="lg"
            />
          </div>
        )}

        {/* Additional help text */}
        {errorType === 'network' && (
          <p className="text-sm text-gray-500 mt-6">
            <Wifi className="w-4 h-4 inline mr-1" />
            Verifica tu conexión a internet
          </p>
        )}
      </div>
    </Card>
  )
}

export default ErrorState