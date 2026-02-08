/**
 * Error Handler Service
 * Manejo centralizado de errores con logging y transformación
 */

import { getErrorMessage, isNetworkError, isClientError, isServerError } from '../lib/react-query'

// ============================================
// TYPES
// ============================================

export interface ErrorInfo {
  message: string
  status?: number
  code?: string
  type: 'network' | 'client' | 'server' | 'unknown'
  isRetryable: boolean
  userMessage: string
  technicalMessage: string
}

// ============================================
// ERROR CLASSIFICATION
// ============================================

/**
 * Clasifica y transforma un error en ErrorInfo
 */
export const classifyError = (error: unknown): ErrorInfo => {
  const message = getErrorMessage(error)
  
  // Determinar tipo de error
  let type: ErrorInfo['type'] = 'unknown'
  let status: number | undefined
  let code: string | undefined
  
  if (isNetworkError(error)) {
    type = 'network'
  } else if (isClientError(error)) {
    type = 'client'
    status = (error as any).response?.status
  } else if (isServerError(error)) {
    type = 'server'
    status = (error as any).response?.status
  }
  
  // Extraer código de error si existe
  if (typeof error === 'object' && error !== null && 'code' in error) {
    code = (error as any).code
  }
  
  // Determinar si es retryable
  const isRetryable = type === 'network' || type === 'server'
  
  // Generar mensajes
  const userMessage = getUserFriendlyMessage(type, status, message)
  const technicalMessage = message
  
  return {
    message,
    status,
    code,
    type,
    isRetryable,
    userMessage,
    technicalMessage,
  }
}

// ============================================
// USER FRIENDLY MESSAGES
// ============================================

/**
 * Convierte errores técnicos en mensajes amigables
 */
const getUserFriendlyMessage = (
  type: ErrorInfo['type'],
  status?: number,
  originalMessage?: string
): string => {
  // Mensajes por tipo
  switch (type) {
    case 'network':
      return 'Sin conexión a internet. Verifica tu conexión y vuelve a intentar.'
    
    case 'client':
      return getClientErrorMessage(status, originalMessage)
    
    case 'server':
      return 'Estamos teniendo problemas con nuestros servidores. Intenta de nuevo en unos momentos.'
    
    default:
      return originalMessage || 'Algo salió mal. Por favor intenta de nuevo.'
  }
}

/**
 * Mensajes específicos para errores del cliente (4xx)
 */
const getClientErrorMessage = (status?: number, originalMessage?: string): string => {
  switch (status) {
    case 400:
      return 'Los datos enviados no son válidos. Verifica e intenta de nuevo.'
    
    case 401:
      return 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
    
    case 403:
      return 'No tienes permiso para realizar esta acción.'
    
    case 404:
      return 'No pudimos encontrar lo que buscas.'
    
    case 409:
      return 'Este elemento ya existe o hay un conflicto.'
    
    case 422:
      return originalMessage || 'Los datos enviados no son válidos.'
    
    case 429:
      return 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.'
    
    default:
      return originalMessage || 'Error en la solicitud. Verifica los datos e intenta de nuevo.'
  }
}

// ============================================
// ERROR LOGGING
// ============================================

/**
 * Registra errores (en producción enviaría a servicio de logging)
 */
export const logError = (
  error: unknown,
  context?: {
    component?: string
    action?: string
    userId?: string
    metadata?: Record<string, any>
  }
) => {
  const errorInfo = classifyError(error)
  
  // En desarrollo, log a consola
  if (import.meta.env.DEV) {
    console.group(`🔴 Error: ${errorInfo.type}`)
    console.error('User Message:', errorInfo.userMessage)
    console.error('Technical Message:', errorInfo.technicalMessage)
    if (errorInfo.status) console.error('Status:', errorInfo.status)
    if (errorInfo.code) console.error('Code:', errorInfo.code)
    if (context) console.error('Context:', context)
    console.error('Original Error:', error)
    console.groupEnd()
  }
  
  // En producción, enviar a servicio de logging
  if (import.meta.env.PROD) {
    // TODO: Integrar con Sentry, LogRocket, etc.
    // Ejemplo:
    // Sentry.captureException(error, {
    //   level: errorInfo.type === 'server' ? 'error' : 'warning',
    //   tags: {
    //     errorType: errorInfo.type,
    //     component: context?.component,
    //   },
    //   extra: {
    //     ...context,
    //     errorInfo,
    //   },
    // })
  }
}

// ============================================
// ERROR HANDLING HELPERS
// ============================================

/**
 * Maneja errores de forma consistente
 */
export const handleError = (
  error: unknown,
  options?: {
    component?: string
    action?: string
    showToast?: boolean
    onError?: (errorInfo: ErrorInfo) => void
  }
): ErrorInfo => {
  const errorInfo = classifyError(error)
  
  // Log error
  logError(error, {
    component: options?.component,
    action: options?.action,
  })
  
  // Mostrar toast si se solicita
  if (options?.showToast) {
    // Importar dinámicamente para evitar dependencia circular
    import('../lib/toast').then((toast) => {
      toast.default.error(errorInfo.userMessage)
    })
  }
  
  // Callback personalizado
  options?.onError?.(errorInfo)
  
  return errorInfo
}

/**
 * Extrae mensaje de error de validación de formulario
 */
export const extractValidationErrors = (error: unknown): Record<string, string> => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as any).response === 'object' &&
    (error as any).response !== null
  ) {
    const response = (error as any).response
    
    // Formato común: { errors: { field: "message" } }
    if (response.data?.errors && typeof response.data.errors === 'object') {
      return response.data.errors
    }
    
    // Formato alternativo: { field: "message" }
    if (response.data && typeof response.data === 'object') {
      const errors: Record<string, string> = {}
      Object.entries(response.data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          errors[key] = value
        }
      })
      if (Object.keys(errors).length > 0) {
        return errors
      }
    }
  }
  
  return {}
}

// ============================================
// EXPORTS
// ============================================

export default {
  classify: classifyError,
  log: logError,
  handle: handleError,
  extractValidationErrors,
}