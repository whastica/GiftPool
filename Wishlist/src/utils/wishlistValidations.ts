/**
 * Validation utilities for wishlist creation
 */

/**
 * Valida si una URL es válida
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valida si una URL es de MercadoLibre
 */
export const isMercadoLibreUrl = (url: string): boolean => {
  const mercadoLibrePattern = /mercadolibre\.com\.(co|mx|ar|br|cl|pe|uy|ve|ec|bo|py)/i
  return mercadoLibrePattern.test(url)
}

/**
 * Extrae el ID del producto de una URL de MercadoLibre
 */
export const extractMercadoLibreId = (url: string): string | null => {
  const match = url.match(/ML[A-Z]-\d+/i)
  return match ? match[0] : null
}

/**
 * Valida el nombre del evento
 */
export const validateEventTitle = (title: string): { isValid: boolean; error?: string } => {
  if (!title.trim()) {
    return { isValid: false, error: 'El nombre del evento es obligatorio' }
  }

  if (title.trim().length < 3) {
    return { isValid: false, error: 'El nombre debe tener al menos 3 caracteres' }
  }

  if (title.trim().length > 100) {
    return { isValid: false, error: 'El nombre no puede exceder 100 caracteres' }
  }

  return { isValid: true }
}

/**
 * Valida la fecha del evento
 */
export const validateEventDate = (dateString: string): { isValid: boolean; error?: string } => {
  if (!dateString) {
    return { isValid: false, error: 'La fecha del evento es obligatoria' }
  }

  const selectedDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (isNaN(selectedDate.getTime())) {
    return { isValid: false, error: 'Fecha inválida' }
  }

  if (selectedDate < today) {
    return { isValid: false, error: 'La fecha debe ser futura' }
  }

  // Validar que no sea más de 1 año en el futuro
  const oneYearFromNow = new Date()
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  if (selectedDate > oneYearFromNow) {
    return { isValid: false, error: 'La fecha no puede ser más de 1 año en el futuro' }
  }

  return { isValid: true }
}

/**
 * Valida el mensaje personal
 */
export const validateMessage = (message: string): { isValid: boolean; error?: string } => {
  if (message.length > 500) {
    return { isValid: false, error: 'El mensaje no puede exceder 500 caracteres' }
  }

  return { isValid: true }
}

/**
 * Valida todo el formulario de wishlist
 */
export const validateWishlistForm = (
  productUrl: string,
  eventTitle: string,
  eventDate: string,
  message: string
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  if (!isValidUrl(productUrl)) {
    errors.productUrl = 'URL inválida'
  } else if (!isMercadoLibreUrl(productUrl)) {
    errors.productUrl = 'Solo se aceptan URLs de MercadoLibre'
  }

  const titleValidation = validateEventTitle(eventTitle)
  if (!titleValidation.isValid) {
    errors.eventTitle = titleValidation.error!
  }

  const dateValidation = validateEventDate(eventDate)
  if (!dateValidation.isValid) {
    errors.eventDate = dateValidation.error!
  }

  const messageValidation = validateMessage(message)
  if (!messageValidation.isValid) {
    errors.message = messageValidation.error!
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Formatea una fecha para mostrar
 */
export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Calcula días restantes hasta el evento
 */
export const getDaysUntilEvent = (dateString: string): number => {
  const eventDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)

  const diffTime = eventDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}