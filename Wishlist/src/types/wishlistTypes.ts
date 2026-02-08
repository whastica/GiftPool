/**
 * Types para el sistema de wishlists
 */

// ============================================
// PRODUCT TYPES
// ============================================

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

export interface ProductValidation {
  isValid: boolean
  error?: string
  product?: Product
}

// ============================================
// CONTRIBUTOR TYPES
// ============================================

export interface Contributor {
  id: string
  name: string
  amount: number
  message?: string
  videoUrl?: string
  isAnonymous: boolean
  createdAt: string
}

// ============================================
// WISHLIST TYPES
// ============================================

export type WishlistStatus = 'active' | 'completed' | 'cancelled' | 'expired'

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
  status: WishlistStatus
  contributors: Contributor[]
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export interface WishlistFormData {
  productUrl: string
  eventTitle: string
  eventDate: string
  message: string
  targetAmount?: number
}

export interface WishlistCreationResponse {
  success: boolean
  wishlist?: Wishlist
  error?: string
}

// ============================================
// DASHBOARD TYPES
// ============================================

export type WishlistFilter = 'all' | 'active' | 'completed' | 'expired'

export interface DashboardStats {
  activeWishlists: number
  completed: number
  expired: number
  totalRaised: number
  videosReceived: number
  totalContributors: number
}

export interface WishlistListItem {
  id: string
  slug: string
  title: string
  eventDate: string
  product: {
    name: string
    image: string
  }
  currentAmount: number
  targetAmount: number
  contributors: number
  status: WishlistStatus
  createdAt: string
  completedAt?: string
  hasVideos: boolean
}

// ============================================
// WIZARD TYPES
// ============================================

export type WizardStep = 1 | 2 | 3

export interface WizardState {
  currentStep: WizardStep
  formData: WishlistFormData
  productData: Product | null
  isLoading: boolean
  error: string | null
}

// ============================================
// UTILITY TYPES
// ============================================

export interface WishlistSortOptions {
  field: 'createdAt' | 'eventDate' | 'currentAmount' | 'title'
  direction: 'asc' | 'desc'
}

export interface WishlistFilters {
  status?: WishlistFilter
  search?: string
  dateRange?: {
    from: string
    to: string
  }
}