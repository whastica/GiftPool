/**
 * ErrorFallback Component
 * UI de fallback cuando ocurre un error no capturado
 */

import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Button from '../ui/Button'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const handleReload = () => {
    window.location.href = '/'
  }

  const isDevelopment = import.meta.env.DEV

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            ¡Ups! Algo salió mal
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 text-center mb-8">
            Encontramos un error inesperado. Nuestro equipo ha sido notificado
            y estamos trabajando para solucionarlo.
          </p>

          {/* Error Details (solo en desarrollo) */}
          {isDevelopment && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
              <p className="text-sm font-mono text-gray-700 mb-2">
                <strong>Error:</strong> {error.message}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    Ver stack trace
                  </summary>
                  <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={resetErrorBoundary}
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reintentar
            </Button>
            
            <Button
              onClick={handleReload}
              variant="outline"
              size="lg"
              className="flex-1 sm:flex-none"
            >
              <Home className="w-5 h-5 mr-2" />
              Ir al inicio
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Si el problema persiste, contáctanos en{' '}
              <a
                href="mailto:soporte@giftpool.co"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                soporte@giftpool.co
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Error ID: {Date.now().toString(36).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorFallback