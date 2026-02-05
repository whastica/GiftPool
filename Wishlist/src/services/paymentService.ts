/**
 * Payment Service (EPIC 6)
 * Servicio completo para manejo de pagos y contribuciones
 */

import api from './api'
import type {
  ContributionData,
  ContributionResponse,
  PaymentMethod,
} from '../types/contributeTypes'

/* -------------------------------------------------------------------------- */
/* MÉTODOS DE PAGO DISPONIBLES */
/* -------------------------------------------------------------------------- */

/**
 * Obtener métodos de pago disponibles
 */
export const getAvailablePaymentMethods = (): PaymentMethod[] => {
  // En DEV: todos disponibles
  if (import.meta.env.DEV) {
    return ['mercadopago', 'paypal']
  }

  // En PROD: consultar al backend cuáles están activos
  // Por ahora retornamos los básicos
  return ['mercadopago', 'paypal']
}

/* -------------------------------------------------------------------------- */
/* INICIAR CONTRIBUCIÓN */
/* -------------------------------------------------------------------------- */

/**
 * Iniciar una contribución (crear registro en backend)
 */
export const initiateContribution = async (
  data: ContributionData
): Promise<ContributionResponse> => {
  // ==================== MODO DESARROLLO ====================
  if (import.meta.env.DEV) {
    console.log('🧪 DEV MODE: Simulating contribution initiation', data)
    
    // Simular delay de red
    await delay(1200)

    // Validaciones básicas
    if (!data.amount || data.amount < 10000) {
      return {
        success: false,
        error: 'El monto mínimo es $10,000',
      }
    }

    if (!data.paymentMethod) {
      return {
        success: false,
        error: 'Debes seleccionar un método de pago',
      }
    }

    if (!data.isAnonymous && !data.name.trim()) {
      return {
        success: false,
        error: 'El nombre es obligatorio',
      }
    }

    // Generar ID de contribución simulado
    const contributionId = `CONTRIB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Simular respuesta exitosa
    return {
      success: true,
      contributionId,
      // En DEV, redirigir directamente a la página de checkout local
      paymentUrl: `/contribute/checkout/${contributionId}`,
    }
  }

  // ==================== MODO PRODUCCIÓN ====================
  try {
    const response = await api.post('/contributions/create', {
      wishlistId: data.wishlistId,
      amount: data.amount,
      name: data.name,
      email: data.email,
      message: data.message,
      isAnonymous: data.isAnonymous,
      includeVideo: data.includeVideo,
      paymentMethod: data.paymentMethod,
    })

    return response.data
  } catch (error: any) {
    console.error('Error initiating contribution:', error)
    
    return {
      success: false,
      error: error.response?.data?.message || 'Error al procesar la contribución',
    }
  }
}

/* -------------------------------------------------------------------------- */
/* CHECKOUT */
/* -------------------------------------------------------------------------- */

export interface CheckoutResponse {
  checkoutUrl: string
}

/**
 * Obtener URL de checkout para una contribución
 */
export const getCheckoutUrl = async (
  contributionId: string
): Promise<CheckoutResponse> => {
  // ==================== MODO DESARROLLO ====================
  if (import.meta.env.DEV) {
    console.log('🧪 DEV MODE: Simulating checkout redirect', contributionId)
    await delay(800)

    return {
      checkoutUrl: `/contribute/success/${contributionId}`,
    }
  }

  // ==================== MODO PRODUCCIÓN ====================
  const response = await api.get(`/payments/checkout/${contributionId}`)
  return response.data
}

/* -------------------------------------------------------------------------- */
/* CONFIRMAR PAGO */
/* -------------------------------------------------------------------------- */

export interface ConfirmPaymentResponse {
  contributionId: string
  amount: number
  paymentMethod: 'mercadopago' | 'paypal' | 'nequi'
  transactionId: string
  paidAt: string
}

/**
 * Confirmar que un pago fue completado
 */
export const confirmPayment = async (
  contributionId: string
): Promise<ConfirmPaymentResponse | null> => {
  // ==================== MODO DESARROLLO ====================
  if (import.meta.env.DEV) {
    console.log('🧪 DEV MODE: Simulating payment confirmation', contributionId)
    await delay(800)

    return {
      contributionId,
      amount: 50000,
      paymentMethod: 'mercadopago',
      transactionId: `TX-${Date.now()}`,
      paidAt: new Date().toISOString(),
    }
  }

  // ==================== MODO PRODUCCIÓN ====================
  const response = await api.get(`/payments/confirm/${contributionId}`)
  return response.data
}

/* -------------------------------------------------------------------------- */
/* UTILIDADES */
/* -------------------------------------------------------------------------- */

/**
 * Helper para simular delays en DEV
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Validar datos de contribución
 */
export const validateContributionData = (
  data: Partial<ContributionData>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  if (!data.amount || data.amount < 10000) {
    errors.amount = 'El monto mínimo es $10,000'
  }

  if (!data.isAnonymous && !data.name?.trim()) {
    errors.name = 'El nombre es obligatorio'
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.email = 'Email inválido'
  }

  if (data.message && data.message.length > 300) {
    errors.message = 'El mensaje no puede exceder 300 caracteres'
  }

  if (!data.paymentMethod) {
    errors.paymentMethod = 'Debes seleccionar un método de pago'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validar email
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}