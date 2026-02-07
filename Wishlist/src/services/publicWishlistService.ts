// src/services/publicWishlistService.ts - EPIC 7 ACTUALIZADO
import api from './api'
import type { PublicWishlist, ContributeFormData } from '../types/publicWishlistTypes'
import { mockWishlist } from '../mocks/mockData'
import { getMockContributions } from './mockContributionsManager'

export const publicWishlistService = {
  /**
   * Obtener wishlist pública por slug
   */
  async getBySlug(slug: string): Promise<PublicWishlist> {
    if (import.meta.env.DEV) {
      await simulateDelay(500)
      
      if (slug === mockWishlist.slug || slug === 'wl_mock_123') {
        const wishlistWithContributions = loadMockContributions(mockWishlist)
        return normalizeMockWishlist(wishlistWithContributions, slug)
      }
      
      return getMockWishlist(slug)
    }

    try {
      const response = await api.get(`/wishlists/public/${slug}`)
      return response.data as PublicWishlist
    } catch (error: any) {
      console.error('Error fetching wishlist:', error)
      throw new Error(error?.response?.data?.message ?? 'No se pudo cargar la wishlist')
    }
  },

  async trackView(wishlistId: string): Promise<void> {
    try {
      if (!import.meta.env.DEV) {
        await api.post(`/wishlists/${wishlistId}/view`)
      }
    } catch (error) {
      console.debug('Error tracking wishlist view:', error)
    }
  },
}

/**
 * ✅ EPIC 7: Cargar contribuciones con videos desde IndexedDB
 */
function loadMockContributions(baseWishlist: PublicWishlist): PublicWishlist {
  try {
    const wishlistContributions = getMockContributions(baseWishlist.id)
    
    if (wishlistContributions.length === 0) return baseWishlist

    // Combinar contribuciones
    const allContributors = [...baseWishlist.contributors, ...wishlistContributions]
    const totalAmount = allContributors.reduce((sum, c) => sum + c.amount, 0)

    console.log(`✅ Loaded ${wishlistContributions.length} mock contributions (${wishlistContributions.filter(c => c.videoUrl).length} with videos)`)

    return {
      ...baseWishlist,
      contributors: allContributors,
      contributorsCount: allContributors.length,
      currentAmount: totalAmount,
      status: totalAmount >= baseWishlist.targetAmount ? 'completed' : baseWishlist.status,
    }
  } catch (error) {
    console.error('❌ Error loading mock contributions:', error)
    return baseWishlist
  }
}

function simulateDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function normalizeMockWishlist(mock: PublicWishlist, slug: string): PublicWishlist {
  return { ...mock, slug }
}

function getMockWishlist(slug: string): PublicWishlist {
  const now = new Date()
  const eventDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  return {
    id: 'wl_mock_dynamic',
    slug,
    title: 'Wishlist de ejemplo',
    eventDate: eventDate.toISOString(),
    message: 'Esta es una wishlist generada automáticamente para desarrollo.',
    ownerName: 'Usuario Demo',
    ownerAvatar: undefined,
    product: {
      id: 'prod_mock',
      name: 'Producto de ejemplo',
      description: 'Producto mock para entorno de desarrollo',
      price: 250000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      url: 'https://example.com',
      marketplace: 'DemoStore',
      available: true,
    },
    targetAmount: 250000,
    currentAmount: 90000,
    status: 'active',
    contributorsCount: 3,
    contributors: [
      {
        id: 'c1',
        name: 'Ana',
        amount: 30000,
        isAnonymous: false,
        createdAt: now.toISOString(),
      },
      {
        id: 'c2',
        name: 'Luis',
        amount: 40000,
        isAnonymous: false,
        createdAt: now.toISOString(),
      },
      {
        id: 'c3',
        name: 'Anónimo',
        amount: 20000,
        isAnonymous: true,
        createdAt: now.toISOString(),
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: eventDate.toISOString(),
  }
}