/**
 * Types extendidos para wishlist pública (EPIC 5)
 */

export type WishlistStatus = 'active' | 'completed' | 'expired' | 'cancelled'

export interface PublicProduct {
  id: string
  name: string
  description?: string
  price: number
  image: string
  url: string
  marketplace: string
  available: boolean
}

export interface PublicContributor {
  id: string
  name: string
  amount: number
  message?: string
  videoUrl?: string
  avatar?: string
  isAnonymous: boolean
  createdAt: string
}

export interface PublicWishlist {
  id: string
  slug: string
  title: string
  eventDate: string
  message: string
  ownerName: string
  ownerAvatar?: string
  product: PublicProduct
  targetAmount: number
  currentAmount: number
  status: WishlistStatus
  contributors: PublicContributor[]
  contributorsCount: number
  createdAt: string
  updatedAt: string
  expiresAt?: string
  completedAt?: string
}

export interface ContributeFormData {
  amount: number
  name: string
  email?: string
  message?: string
  isAnonymous: boolean
  includeVideo: boolean
}

export interface WishlistMetaTags {
  title: string
  description: string
  image: string
  url: string
  siteName: string
  type: string
}

export interface ShareOptions {
  url: string
  title: string
  text: string
}