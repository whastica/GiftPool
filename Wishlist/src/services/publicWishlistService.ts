// src/services/publicWishlistService.ts

import api from './api'
import type { PublicWishlist, ContributeFormData } from '../types/publicWishlistTypes'
import { mockWishlist } from '../mocks/mockData'

/**
 * Servicio para operaciones públicas de wishlists
 * No requieren autenticación
 */
export const publicWishlistService = {
  /**
   * Obtener wishlist pública por slug
   */
  async getBySlug(slug: string): Promise<PublicWishlist> {
    // ─────────────────────────────────────────────
    // DEV MODE → usar mocks
    // ─────────────────────────────────────────────
    if (import.meta.env.DEV) {
      await simulateDelay(500)

      if (slug === mockWishlist.slug || slug === 'wl_mock_123') {
        return normalizeMockWishlist(mockWishlist, slug)
      }

      return getMockWishlist(slug)
    }

    // ─────────────────────────────────────────────
    // PROD MODE → backend real
    // ─────────────────────────────────────────────
    try {
      const response = await api.get(`/wishlists/public/${slug}`)
      return response.data as PublicWishlist
    } catch (error: any) {
      console.error('Error fetching wishlist:', error)
      throw new Error(
        error?.response?.data?.message ?? 'No se pudo cargar la wishlist'
      )
    }
  },

  /**
   * Crear contribución a una wishlist
   */
 async contribute(
  wishlistId: string,
  data: ContributeFormData
): Promise<{ success: boolean; checkoutUrl?: string }> {
  if (import.meta.env.DEV) {
    await simulateDelay(600)

    return {
      success: true,
      checkoutUrl: `/contribute/checkout/contrib_${Date.now()}?method=mercadopago`,
    }
  }

  const response = await api.post(
    `/wishlists/${wishlistId}/contribute`,
    data
  )

  return {
    success: true,
    checkoutUrl: response.data.checkoutUrl,
  }
},

  /**
   * Registrar visualización de wishlist (analytics)
   */
  async trackView(wishlistId: string): Promise<void> {
    // No bloquear UI por analytics
    try {
      if (!import.meta.env.DEV) {
        await api.post(`/wishlists/${wishlistId}/view`)
      }
    } catch (error) {
      console.debug('Error tracking wishlist view:', error)
    }
  },
}

/* ───────────────────────────────────────────── */
/* Helpers                                      */
/* ───────────────────────────────────────────── */

function simulateDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Normaliza el mock principal para que siempre cumpla el contrato
 */
function normalizeMockWishlist(
  mock: PublicWishlist,
  slug: string
): PublicWishlist {
  return {
    ...mock,
    slug,
  }
}

/**
 * Mock dinámico por slug (fallback)
 */
function getMockWishlist(slug: string): PublicWishlist {
  const now = new Date()
  const eventDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  return {
    id: 'wl_mock_dynamic',
    slug,
    title: 'Wishlist de ejemplo',
    eventDate: eventDate.toISOString(),
    message:
      'Esta es una wishlist generada automáticamente para desarrollo.',
    ownerName: 'Usuario Demo',
    ownerAvatar: undefined,

    product: {
      id: 'prod_mock',
      name: 'Producto de ejemplo',
      description: 'Producto mock para entorno de desarrollo',
      price: 250000,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
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
