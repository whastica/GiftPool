/**
 * ErrorBoundary Component
 * Captura errores de React y muestra UI de fallback
 */

import { Component, type ReactNode } from 'react'
import ErrorFallback from './ErrorFallback'
import { logError } from '../../services/errorHandler'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, resetErrorBoundary: () => void) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Actualizar estado para renderizar fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log del error
    logError(error, {
      component: 'ErrorBoundary',
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    })

    // Callback personalizado
    this.props.onError?.(error, errorInfo)
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Usar fallback personalizado si existe
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetErrorBoundary)
      }

      // Fallback por defecto
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary