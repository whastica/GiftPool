import { useState, useCallback } from 'react'
import type {
  WizardStep,
  WizardState,
  WishlistFormData,
  Product,
} from '../types/wishlistTypes'
import { wishlistService } from '../services/wishlistService'

const INITIAL_FORM_DATA: WishlistFormData = {
  productUrl: '',
  eventTitle: '',
  eventDate: '',
  message: '',
}

/**
 * Hook personalizado para manejar el flujo del wizard de creación de wishlist
 */
export const useWishlistWizard = () => {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    formData: INITIAL_FORM_DATA,
    productData: null,
    isLoading: false,
    error: null,
  })

  /**
   * Actualizar datos del formulario
   */
  const updateFormData = useCallback((updates: Partial<WishlistFormData>) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
      error: null,
    }))
  }, [])

  /**
   * Navegar a un paso específico
   */
  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
      error: null,
    }))
  }, [])

  /**
   * Avanzar al siguiente paso
   */
  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: (Math.min(prev.currentStep + 1, 3) as WizardStep),
      error: null,
    }))
  }, [])

  /**
   * Retroceder al paso anterior
   */
  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: (Math.max(prev.currentStep - 1, 1) as WizardStep),
      error: null,
    }))
  }, [])

  /**
   * Validar y cargar producto desde URL
   */
  const loadProduct = useCallback(async () => {
    const { productUrl } = state.formData

    // Validación de URL
    if (!productUrl.trim()) {
      setState((prev) => ({
        ...prev,
        error: 'Por favor ingresa una URL válida',
      }))
      return false
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const validation = await wishlistService.validateProductUrl(productUrl)

      if (!validation.isValid) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: validation.error || 'Error al validar el producto',
        }))
        return false
      }

      // Calcular monto objetivo con comisión
      const targetAmount = wishlistService.calculateTargetAmount(
        validation.product!.price
      )

      setState((prev) => ({
        ...prev,
        productData: validation.product!,
        formData: { ...prev.formData, targetAmount },
        isLoading: false,
        currentStep: 2,
        error: null,
      }))

      return true
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Error inesperado al cargar el producto',
      }))
      return false
    }
  }, [state.formData])

  /**
   * Validar datos del evento antes de continuar
   */
  const validateEventData = useCallback((): boolean => {
    const { eventTitle, eventDate } = state.formData

    if (!eventTitle.trim()) {
      setState((prev) => ({
        ...prev,
        error: 'El nombre del evento es obligatorio',
      }))
      return false
    }

    if (eventTitle.trim().length < 3) {
      setState((prev) => ({
        ...prev,
        error: 'El nombre del evento debe tener al menos 3 caracteres',
      }))
      return false
    }

    if (!eventDate) {
      setState((prev) => ({
        ...prev,
        error: 'La fecha del evento es obligatoria',
      }))
      return false
    }

    // Validar que la fecha sea futura
    const selectedDate = new Date(eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      setState((prev) => ({
        ...prev,
        error: 'La fecha del evento debe ser futura',
      }))
      return false
    }

    return true
  }, [state.formData])

  /**
   * Crear wishlist
   */
  const createWishlist = useCallback(async () => {
    if (!validateEventData()) {
      return null
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const result = await wishlistService.createWishlist(state.formData)

      if (!result.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Error al crear la wishlist',
        }))
        return null
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        currentStep: 3,
        error: null,
      }))

      return result.wishlist
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Error inesperado al crear la wishlist',
      }))
      return null
    }
  }, [state.formData, validateEventData])

  /**
   * Reiniciar wizard
   */
  const resetWizard = useCallback(() => {
    setState({
      currentStep: 1,
      formData: INITIAL_FORM_DATA,
      productData: null,
      isLoading: false,
      error: null,
    })
  }, [])

  return {
    // Estado
    currentStep: state.currentStep,
    formData: state.formData,
    productData: state.productData,
    isLoading: state.isLoading,
    error: state.error,

    // Acciones
    updateFormData,
    goToStep,
    nextStep,
    previousStep,
    loadProduct,
    validateEventData,
    createWishlist,
    resetWizard,
  }
}