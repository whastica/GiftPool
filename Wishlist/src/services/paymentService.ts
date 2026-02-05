/**
 * Payment Service (EPIC 6)
 * Servicio completo para manejo de pagos y contribuciones
 */
import api from './api'
import type {
  ContributionData as ContributionDataType,
  ContributionResponse as ContributionResponseType,
  PaymentMethod as PaymentMethodType,
} from '../types/contributeTypes'

/* -------------------------------------------------------------------------- */
/* MÉTODOS DE PAGO DISPONIBLES */
/* -------------------------------------------------------------------------- */

/**
 * Obtener métodos de pago disponibles
 */
export const getAvailablePaymentMethods = (): PaymentMethodType[] => {
  // En DEV: todos disponibles
  if (import.meta.env.DEV) {
    return ['mercadopago', 'paypal']
  }

  // En PROD: consultar al backend cuáles están activos
  return ['mercadopago', 'paypal']
}

/* -------------------------------------------------------------------------- */
/* EPIC 6: MOCK CONTRIBUTIONS STORAGE */
/* -------------------------------------------------------------------------- */

const MOCK_CONTRIBUTIONS_KEY = 'giftpool_mock_contributions'

/**
 * Guardar contribución en localStorage
 */
const saveMockContribution = (wishlistId: string, contribution: {
  id: string;
  name: string;
  amount: number;
  message: string;
  isAnonymous: boolean;
  createdAt: string;
}): void => {
  try {
    const stored = localStorage.getItem(MOCK_CONTRIBUTIONS_KEY)
    const contributions: Record<string, any[]> = stored ? JSON.parse(stored) : {}
    
    if (!contributions[wishlistId]) {
      contributions[wishlistId] = []
    }
    
    contributions[wishlistId].push(contribution)
    
    localStorage.setItem(MOCK_CONTRIBUTIONS_KEY, JSON.stringify(contributions))
    
    console.log('✅ Mock contribution saved to localStorage:', contribution)
    console.log('📦 Total contributions for wishlist:', contributions[wishlistId].length)
  } catch (error) {
    console.error('❌ Error saving mock contribution:', error)
  }
};

/* -------------------------------------------------------------------------- */
/* INICIAR CONTRIBUCIÓN */
/* -------------------------------------------------------------------------- */

/**
 * Iniciar una contribución (crear registro en backend)
 */
export const initiateContribution = async (
  data: ContributionDataType
): Promise<ContributionResponseType> => {
  if (import.meta.env.DEV) {
    console.log('🛠️ DEV MODE: Simulating contribution initiation', data);

    // Simular delay de red
    await delay(1200);

    // Validaciones básicas
    if (!data.amount || data.amount < 10000) {
      return {
        success: false,
        error: 'El monto mínimo es $10,000',
      };
    }

    if (!data.paymentMethod) {
      return {
        success: false,
        error: 'Debes seleccionar un método de pago',
      };
    }

    // Generar ID de contribución simulado
    const contributionId = `CONTRIB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // ✅ Guardar contribución en localStorage
    saveMockContribution(data.wishlistId, {
      id: contributionId,
      name: data.isAnonymous ? 'Anónimo' : data.name,
      amount: data.amount,
      message: data.message || '',
      isAnonymous: data.isAnonymous,
      createdAt: new Date().toISOString(),
    });

    // Simular respuesta exitosa
    return {
      success: true,
      contributionId,
      paymentUrl: `/contribute/checkout/${contributionId}`,
    };
  }

  // Modo producción
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
    });

    return response.data;
  } catch (error: any) {
    console.error('Error initiating contribution:', error);

    return {
      success: false,
      error: error.response?.data?.message || 'Error al procesar la contribución',
    };
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
  if (import.meta.env.DEV) {
    console.log('🧪 DEV MODE: Simulating checkout redirect', contributionId)
    await delay(800)

    return {
      checkoutUrl: `/contribute/success/${contributionId}`,
    }
  }

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
  data: Partial<ContributionDataType>
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