/**
 * Payment Service (EPIC 6 + EPIC 7)
 * Servicio modular para manejo de pagos
 */

import api from './api'
import type { ContributionData, ContributionResponse, PaymentMethod } from '../types/contributeTypes'
import { saveMockContribution } from './mockContributionsManager'

/* ========================================================================== */
/* MÉTODOS DE PAGO                                                            */
/* ========================================================================== */

export const getAvailablePaymentMethods = (): PaymentMethod[] => {
  return ['mercadopago', 'paypal']
}

/* ========================================================================== */
/* INICIAR CONTRIBUCIÓN                                                       */
/* ========================================================================== */

export const initiateContribution = async (data: ContributionData): Promise<ContributionResponse> => {
  return import.meta.env.DEV ? handleDevMode(data) : handleProdMode(data)
}

/**
 * Modo desarrollo - Simulación local
 */
const handleDevMode = async (data: ContributionData): Promise<ContributionResponse> => {
  console.log('🛠️ DEV MODE: Initiating contribution', data)
  await delay(1200)

  // Validar
  const validation = validateBasicData(data)
  if (!validation.isValid) {
    return { success: false, error: validation.error }
  }

  // Generar ID único
  const contributionId = generateContributionId()

  // Guardar contribución (con video si existe)
  const saved = await saveMockContribution(
    data.wishlistId,
    {
      id: contributionId,
      name: data.isAnonymous ? 'Anónimo' : data.name,
      amount: data.amount,
      message: data.message || '',
      isAnonymous: data.isAnonymous,
      createdAt: new Date().toISOString(),
    },
    data.videoBlob 
  )

  if (!saved) {
    return { success: false, error: 'Error al guardar la contribución' }
  }

  return {
    success: true,
    contributionId,
    paymentUrl: `/contribute/checkout/${contributionId}`,
  }
}

/**
 * Modo producción - API real
 */
const handleProdMode = async (data: ContributionData): Promise<ContributionResponse> => {
  try {
    const response = await api.post('/contributions/create', {
      wishlistId: data.wishlistId,
      amount: data.amount,
      name: data.name,
      email: data.email,
      message: data.message || '',
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

/* ========================================================================== */
/* CHECKOUT                                                                   */
/* ========================================================================== */

export interface CheckoutResponse {
  checkoutUrl: string
}

export const getCheckoutUrl = async (contributionId: string): Promise<CheckoutResponse> => {
  if (import.meta.env.DEV) {
    await delay(800)
    return { checkoutUrl: `/contribute/success/${contributionId}` }
  }

  const response = await api.get(`/payments/checkout/${contributionId}`)
  return response.data
}

/* ========================================================================== */
/* CONFIRMAR PAGO                                                             */
/* ========================================================================== */

export interface ConfirmPaymentResponse {
  contributionId: string
  amount: number
  paymentMethod: 'mercadopago' | 'paypal' | 'nequi'
  transactionId: string
  paidAt: string
}

export const confirmPayment = async (contributionId: string): Promise<ConfirmPaymentResponse | null> => {
  if (import.meta.env.DEV) {
    await delay(800)
    return {
      contributionId,
      amount: 50000,
      paymentMethod: 'mercadopago',
      transactionId: `TX-${Date.now()}`,
      paidAt: new Date().toISOString(),
    }
  }

  const response = await api.get(`/payments/confirm/${contributionId}`)
  return response.data
}

/* ========================================================================== */
/* VALIDACIONES                                                               */
/* ========================================================================== */

export const validateContributionData = (
  data: Partial<ContributionData>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  if (!data.amount || data.amount < 10000) errors.amount = 'El monto mínimo es $10,000'
  if (!data.isAnonymous && !data.name?.trim()) errors.name = 'El nombre es obligatorio'
  if (data.email && !isValidEmail(data.email)) errors.email = 'Email inválido'
  if (data.message && data.message.length > 300) errors.message = 'Máximo 300 caracteres'
  if (!data.paymentMethod) errors.paymentMethod = 'Selecciona un método de pago'

  return { isValid: Object.keys(errors).length === 0, errors }
}

/**
 * Validación básica para modo dev
 */
const validateBasicData = (data: ContributionData): { isValid: boolean; error?: string } => {
  if (!data.amount || data.amount < 10000) {
    return { isValid: false, error: 'El monto mínimo es $10,000' }
  }
  if (!data.paymentMethod) {
    return { isValid: false, error: 'Debes seleccionar un método de pago' }
  }
  return { isValid: true }
}

/* ========================================================================== */
/* UTILIDADES                                                                 */
/* ========================================================================== */

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const generateContributionId = (): string => {
  return `CONTRIB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}