// src/services/publicWishlistService.ts
import api from './api'
import type { PublicWishlist, ContributeFormData, PublicContributor } from '../types/publicWishlistTypes'
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
    // DEV MODE → usar mocks con contribuciones dinámicas
    // ─────────────────────────────────────────────
    if (import.meta.env.DEV) {
      await simulateDelay(500)
      
      if (slug === mockWishlist.slug || slug === 'wl_mock_123') {
        // ✅ EPIC 6: Cargar contribuciones dinámicas desde localStorage
        const wishlistWithContributions = loadMockContributions(mockWishlist)
        return normalizeMockWishlist(wishlistWithContributions, slug)
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
      
      // ✅ EPIC 6: Guardar contribución en localStorage para simular persistencia
      const contributionId = `contrib_${Date.now()}`
      
      saveMockContribution(wishlistId, {
        id: contributionId,
        name: data.isAnonymous ? 'Anónimo' : data.name,
        amount: data.amount,
        message: data.message,
        isAnonymous: data.isAnonymous,
        createdAt: new Date().toISOString(),
      })

      return {
        success: true,
        checkoutUrl: `/contribute/checkout/${contributionId}?method=mercadopago`,
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
/* EPIC 6: Mock Contributions System            */
/* ───────────────────────────────────────────── */

const MOCK_CONTRIBUTIONS_KEY = 'giftpool_mock_contributions'

/**
 * Guardar contribución mock en localStorage
 */
function saveMockContribution(wishlistId: string, contribution: PublicContributor): void {
  try {
    const stored = localStorage.getItem(MOCK_CONTRIBUTIONS_KEY)
    const contributions: Record<string, PublicContributor[]> = stored ? JSON.parse(stored) : {}
    
    if (!contributions[wishlistId]) {
      contributions[wishlistId] = []
    }
    
    contributions[wishlistId].push(contribution)
    
    localStorage.setItem(MOCK_CONTRIBUTIONS_KEY, JSON.stringify(contributions))
    
    console.log('✅ Mock contribution saved:', contribution)
  } catch (error) {
    console.error('❌ Error saving mock contribution:', error)
  }
}

/**
 * Cargar contribuciones mock desde localStorage
 */
function loadMockContributions(baseWishlist: PublicWishlist): PublicWishlist {
  try {
    const stored = localStorage.getItem(MOCK_CONTRIBUTIONS_KEY);
    console.log('🔍 localStorage content:', stored); // Depuración

    if (!stored) return baseWishlist;

    const contributions: Record<string, PublicContributor[]> = JSON.parse(stored);
    const wishlistContributions = contributions[baseWishlist.id] || [];

    if (wishlistContributions.length === 0) return baseWishlist;

    // Combinar contribuciones originales con las nuevas
    const allContributors = [...baseWishlist.contributors, ...wishlistContributions];

    // Calcular totales actualizados
    const totalAmount = allContributors.reduce((sum, c) => sum + c.amount, 0);

    console.log(`✅ Loaded ${wishlistContributions.length} mock contributions for wishlist ${baseWishlist.id}`);
    console.log('🛠️ Updated PublicWishlist object:', {
      ...baseWishlist,
      contributors: allContributors,
      contributorsCount: allContributors.length,
      currentAmount: totalAmount,
      status: totalAmount >= baseWishlist.targetAmount ? 'completed' : baseWishlist.status,
    });

    return {
      ...baseWishlist,
      contributors: allContributors,
      contributorsCount: allContributors.length,
      currentAmount: totalAmount,
      // Actualizar status si se completó la meta
      status: totalAmount >= baseWishlist.targetAmount ? 'completed' : baseWishlist.status,
    }
  } catch (error) {
    console.error('❌ Error loading mock contributions:', error);
    return baseWishlist;
  }
}

/**
 * Limpiar contribuciones mock (útil para testing)
 */
export function clearMockContributions(): void {
  localStorage.removeItem(MOCK_CONTRIBUTIONS_KEY)
  console.log('🗑️ Mock contributions cleared')
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