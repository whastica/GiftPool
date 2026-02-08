/**
 * Types para wishlists públicas
 * Extiende de los tipos base de wishlist
 */

import type { Product, Contributor, WishlistStatus } from './wishlistTypes'

// ============================================
// PUBLIC WISHLIST
// ============================================

export interface PublicWishlist {
  id: string
  slug: string
  title: string
  message: string
  eventDate: string
  product: Product
  targetAmount: number
  currentAmount: number
  status: WishlistStatus
  contributors: Contributor[]
  contributorsCount: number
  createdAt: string
  expiresAt?: string
  
  // Campos adicionales para vista pública
  ownerName: string
  views: number
}

// ============================================
// CONTRIBUTION
// ============================================

export interface ContributeFormData {
  name: string
  email?: string
  amount: number
  message?: string
  isAnonymous: boolean
  recordVideo: boolean
}

export interface ContributionResult {
  success: boolean
  contributionId?: string
  error?: string
}

// ============================================
// SHARE
// ============================================

export interface ShareData {
  url: string
  title: string
  description: string
  image?: string
}

// ============================================
// META TAGS
// ============================================

export interface MetaTags {
  title: string
  description: string
  image: string
  url: string
  type: 'website'
  siteName: string
  locale: string
}

export interface StructuredData {
  '@context': string
  '@type': string
  name: string
  description: string
  image: string
  url: string
  startDate: string
  endDate?: string
  offers?: {
    '@type': string
    price: string
    priceCurrency: string
    availability: string
  }
}