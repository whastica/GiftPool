/**
 * Types para el sistema de wishlists
 */

export interface Product {
  id?: string
  name: string
  price: number
  image: string
  url: string
  available: boolean
  description?: string
  marketplace: 'mercadolibre' | 'amazon' | 'otros'
}

export interface WishlistFormData {
  productUrl: string
  eventTitle: string
  eventDate: string
  message: string
  targetAmount?: number
}

export interface Wishlist {
  id: string
  userId: string
  slug: string
  title: string
  eventDate: string
  message: string
  product: Product
  targetAmount: number
  currentAmount: number
  status: 'active' | 'completed' | 'cancelled'
  contributors: Contributor[]
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export interface Contributor {
  id: string
  name: string
  amount: number
  message?: string
  videoUrl?: string
  isAnonymous: boolean
  createdAt: string
}

export interface ProductValidation {
  isValid: boolean
  error?: string
  product?: Product
}

export interface WishlistCreationResponse {
  success: boolean
  wishlist?: Wishlist
  error?: string
}

// Estados del wizard
export type WizardStep = 1 | 2 | 3

export interface WizardState {
  currentStep: WizardStep
  formData: WishlistFormData
  productData: Product | null
  isLoading: boolean
  error: string | null
}