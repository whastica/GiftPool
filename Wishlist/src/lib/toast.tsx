/**
 * Toast System - Wrapper de react-hot-toast
 * Sistema de notificaciones mejorado con helpers útiles
 */

import toast from 'react-hot-toast'
import type { ReactNode } from 'react'

// ============================================
// BASIC TOASTS
// ============================================

/**
 * Toast de éxito
 */
export const showSuccess = (message: string, duration?: number) => {
  return toast.success(message, {
    duration: duration || 3000,
  })
}

/**
 * Toast de error
 */
export const showError = (message: string, duration?: number) => {
  return toast.error(message, {
    duration: duration || 5000,
  })
}

/**
 * Toast de información
 */
export const showInfo = (message: string, duration?: number) => {
  return toast(message, {
    icon: 'ℹ️',
    duration: duration || 4000,
  })
}

/**
 * Toast de advertencia
 */
export const showWarning = (message: string, duration?: number) => {
  return toast(message, {
    icon: '⚠️',
    duration: duration || 4000,
    style: {
      background: '#f59e0b',
      color: '#fff',
    },
  })
}

/**
 * Toast de carga
 */
export const showLoading = (message: string) => {
  return toast.loading(message)
}

// ============================================
// ADVANCED TOASTS
// ============================================

/**
 * Toast con promesa (automático)
 * Muestra loading, luego success o error según el resultado
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  }
) => {
  return toast.promise(promise, messages)
}

/**
 * Toast con acción (botón)
 */
export const showWithAction = (
  message: string,
  actionLabel: string,
  onAction: () => void,
  type: 'success' | 'error' | 'info' = 'info'
) => {
  const toastFn = type === 'success' ? toast.success : type === 'error' ? toast.error : toast

  return toastFn(
    (t) => (
      <div className="flex items-center justify-between gap-3 w-full">
        <span className="flex-1">{message}</span>
        <button
          onClick={() => {
            onAction()
            toast.dismiss(t.id)
          }}
          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
        >
          {actionLabel}
        </button>
      </div>
    ),
    {
      duration: 6000,
    }
  )
}

/**
 * Toast personalizado con JSX
 */
export const showCustom = (content: string | ReactNode, options?: any) => {
  return toast.custom(content as any, options)
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Descarta un toast específico
 */
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

/**
 * Descarta todos los toasts
 */
export const dismissAll = () => {
  toast.dismiss()
}

/**
 * Remover un toast (con animación)
 */
export const removeToast = (toastId: string) => {
  toast.remove(toastId)
}

// ============================================
// PRESETS ÚTILES
// ============================================

/**
 * Toast para operaciones CRUD
 */
export const crudToasts = {
  created: (entityName: string = 'Elemento') =>
    showSuccess(`${entityName} creado exitosamente`),
  
  updated: (entityName: string = 'Elemento') =>
    showSuccess(`${entityName} actualizado exitosamente`),
  
  deleted: (entityName: string = 'Elemento') =>
    showSuccess(`${entityName} eliminado exitosamente`),
  
  error: (action: string = 'realizar la operación') =>
    showError(`Error al ${action}. Intenta de nuevo.`),
}

/**
 * Toast para autenticación
 */
export const authToasts = {
  loginSuccess: () => showSuccess('¡Bienvenido de nuevo!'),
  loginError: () => showError('Credenciales incorrectas'),
  
  registerSuccess: () => showSuccess('¡Cuenta creada exitosamente!'),
  registerError: () => showError('Error al crear la cuenta'),
  
  logoutSuccess: () => showSuccess('Sesión cerrada'),
  
  sessionExpired: () =>
    showError('Tu sesión ha expirado. Por favor inicia sesión nuevamente.'),
}

/**
 * Toast para validaciones
 */
export const validationToasts = {
  required: (fieldName: string) =>
    showError(`El campo ${fieldName} es obligatorio`),
  
  invalid: (fieldName: string) =>
    showError(`El campo ${fieldName} no es válido`),
  
  minLength: (fieldName: string, minLength: number) =>
    showError(`${fieldName} debe tener al menos ${minLength} caracteres`),
}

/**
 * Toast para red/conexión
 */
export const networkToasts = {
  offline: () =>
    showWarning('Sin conexión a internet. Verifica tu conexión.'),
  
  online: () =>
    showSuccess('Conexión restablecida'),
  
  slowConnection: () =>
    showWarning('Conexión lenta detectada'),
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning,
  loading: showLoading,
  promise: showPromise,
  withAction: showWithAction,
  custom: showCustom,
  dismiss: dismissToast,
  dismissAll,
  remove: removeToast,
  crud: crudToasts,
  auth: authToasts,
  validation: validationToasts,
  network: networkToasts,
}